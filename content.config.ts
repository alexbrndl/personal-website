import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        year: z.number(),
        cover: z.string(),
        tags: z.array(z.string()),
        role: z.string().optional(),
        client: z.string().optional(),
        url: z.string().url().optional(),
        featured: z.boolean().default(false),
        gallery: z.array(z.object({
          type: z.enum(['image', 'video', 'gif']),
          src: z.string(),
          alt: z.string().optional(),
          caption: z.string().optional(),
        })).optional(),
      }),
    }),
  },
})
