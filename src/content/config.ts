import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['launch', 'report', 'guide', 'district']),
    categoryLabel: z.string(),
    coverImage: z.string(),
    coverImageAlt: z.string().default('ProjectHome.sg article'),
    readingTime: z.string().default('5 min read'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
