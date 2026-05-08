// Cloudflare Pages Function — receives lead-form submissions and forwards
// them via Resend to projecthome.sg@gmail.com (or whatever LEAD_TO_EMAIL is
// set to in the Pages env vars).
//
// Endpoint: POST https://projecthome.sg/api/lead
// Required env: RESEND_API_KEY (Secret)
// Optional env: LEAD_TO_EMAIL (Plaintext, defaults to projecthome.sg@gmail.com)

const FROM_ADDRESS = 'ProjectHome.sg <enquiries@projecthome.sg>';
const DEFAULT_TO = 'projecthome.sg@gmail.com';
const SITE_URL = 'https://projecthome.sg/';

const isValidEmail = (s) =>
  typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const escapeHtml = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const json = (status, data) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    return json(500, { ok: false, error: 'Email service not configured.' });
  }

  // Parse JSON body
  let payload;
  try {
    payload = await request.json();
  } catch (_) {
    return json(400, { ok: false, error: 'Invalid request body.' });
  }

  // Honeypot — if a bot filled the hidden `website` field, silently
  // pretend it worked so the bot moves on. Real humans never see this field.
  if (payload && payload.website && String(payload.website).trim() !== '') {
    return json(200, { ok: true });
  }

  const email = (payload.email || '').trim();
  if (!isValidEmail(email)) {
    return json(400, {
      ok: false,
      error: 'A valid email address is required.',
    });
  }

  const name = (payload.name || '').trim();
  const phone = (payload.phone || '').trim();
  const interest = (payload.interest || '').trim();
  const timeline = (payload.timeline || '').trim();
  const message = (payload.message || '').trim();
  const wantsUpdates = !!payload.updates;

  // The blog subscribe form has no name + no message. Treat as subscribe.
  const isSubscribe = !name && !message;

  const to = (env.LEAD_TO_EMAIL || DEFAULT_TO).trim();

  const subject = isSubscribe
    ? 'New newsletter subscription — ProjectHome.sg'
    : 'New enquiry from ProjectHome.sg' + (name ? ' — ' + name : '');

  // Field rows for both text and HTML versions
  const fieldRows = [];
  if (name) fieldRows.push(['Name', name]);
  fieldRows.push(['Email', email]);
  if (phone) fieldRows.push(['Phone', phone]);
  if (interest) fieldRows.push(['Interested in', interest]);
  if (timeline) fieldRows.push(['Timeline', timeline]);
  fieldRows.push(['Wants updates', wantsUpdates ? 'Yes' : 'No']);

  // Plain-text version (for email clients without HTML rendering)
  const textParts = [
    isSubscribe
      ? 'New newsletter subscription submitted via the website.'
      : 'New enquiry submitted via the website.',
    '',
    ...fieldRows.map(([k, v]) => `${k}: ${v}`),
  ];
  if (message) {
    textParts.push('', 'Message:', message);
  }
  textParts.push('', '---', `Sent via the lead form at ${SITE_URL}`);
  const text = textParts.join('\n');

  // HTML version
  const fieldHtml = fieldRows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6a7a7d;font-size:.92em;vertical-align:top;width:140px;">${escapeHtml(
          k
        )}</td><td style="padding:6px 0;color:#1a2326;">${escapeHtml(v)}</td></tr>`
    )
    .join('');
  const messageHtml = message
    ? `<h3 style="font-family:Arial,Helvetica,sans-serif;color:#063943;margin:24px 0 8px;font-size:1.05em;">Message</h3>
       <div style="white-space:pre-wrap;background:#fbf8f3;border-left:4px solid #d19557;padding:14px 18px;border-radius:0 6px 6px 0;color:#1a2326;font-size:.97em;line-height:1.65;">${escapeHtml(
         message
       )}</div>`
    : '';
  const html = `<!doctype html>
<html>
<body style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#1a2326;background:#ffffff;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;">
    <h2 style="color:#063943;margin:0 0 4px;font-size:1.3em;">${escapeHtml(subject)}</h2>
    <p style="color:#6a7a7d;margin:0 0 20px;font-size:.9em;">${
      isSubscribe
        ? 'New subscription via projecthome.sg'
        : 'Reply to this email to respond directly to the visitor.'
    }</p>
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;font-size:.95em;">
      ${fieldHtml}
    </table>
    ${messageHtml}
    <hr style="border:none;border-top:1px solid #e5dfd4;margin:28px 0 12px;" />
    <p style="color:#6a7a7d;font-size:.82em;margin:0;">
      Sent via the lead form at <a href="${SITE_URL}" style="color:#d19557;">projecthome.sg</a>.
    </p>
  </div>
</body>
</html>`;

  const resendBody = {
    from: FROM_ADDRESS,
    to: [to],
    reply_to: email, // hitting Reply in Gmail goes straight to the lead
    subject,
    text,
    html,
  };

  let resendResp;
  try {
    resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(resendBody),
    });
  } catch (_) {
    return json(502, { ok: false, error: 'Could not reach the email service.' });
  }

  if (!resendResp.ok) {
    let detail = '';
    try {
      const errBody = await resendResp.json();
      detail = errBody && (errBody.message || errBody.name)
        ? errBody.message || errBody.name
        : `HTTP ${resendResp.status}`;
    } catch (_) {
      detail = `HTTP ${resendResp.status}`;
    }
    return json(502, { ok: false, error: 'Email service error: ' + detail });
  }

  return json(200, { ok: true });
}
