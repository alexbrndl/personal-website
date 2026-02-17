import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { craftComponentNames } from './app/utils/craft-components'

export default defineContentConfig({
  collections: {
    gallery: defineCollection({
      type: 'data',
      source: 'gallery/*.yml',
      schema: z.object({
        src: z.string(),
        alt: z.string(),
        description: z.string().optional(),
      }),
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        cover: z.string(),
        tags: z.array(z.string()),
        role: z.string().optional(),
        client: z.string().optional(),
        url: z.string().url().optional(),
        featured: z.boolean().default(false),
      }),
    }),
    craft: defineCollection({
      type: 'page',
      source: 'craft/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        tags: z.array(z.string()).optional(),
        component: z.enum(craftComponentNames).optional(),
        cover: z.string().optional(),
        featured: z.boolean().default(false),
      }),
    }),
  },
})
