<script setup lang="ts">
const { t } = useI18n()

const { data: projects, error } = await useAsyncData('gallery-projects', () =>
  queryCollection('projects')
    .order('date', 'DESC')
    .all()
)

if (error.value) {
  console.error('Failed to fetch gallery projects:', error.value)
}

const galleryImages = computed(() => {
  if (!projects.value) return []

  return projects.value.flatMap((project) => {
    const items: { src: string; alt: string; slug: string }[] = []

    if (project.cover) {
      items.push({ src: project.cover, alt: project.title, slug: project.stem })
    }

    for (const item of project.gallery ?? []) {
      if (item.type === 'image') {
        items.push({ src: item.src, alt: item.alt ?? project.title, slug: project.stem })
      }
    }

    return items
  })
})

useSeoMeta({
  title: t('gallery.seo.title'),
  description: t('gallery.seo.description'),
})
</script>

<template>
  <LayoutAside to="/" :label="t('gallery.backToIndex')" />

  <section class="section">
    <p class="section-label">{{ t('gallery.title') }}</p>

    <div class="gallery-stack">
      <NuxtLink
        v-for="img in galleryImages"
        :key="`${img.slug}-${img.src}`"
        :to="`/${img.slug}`"
        :aria-label="img.alt"
        class="gallery-item"
      >
        <NuxtImg
          :src="img.src"
          :alt="img.alt"
          class="gallery-item-img"
          loading="lazy"
        />
      </NuxtLink>
    </div>

    <div v-if="!galleryImages.length" class="gallery-empty">
      <p>{{ t('gallery.empty') }}</p>
    </div>
  </section>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-label {
  color: var(--color-text-muted);
}

.gallery-stack {
  display: flex;
  flex-direction: column;
}

.gallery-item {
  display: block;
  aspect-ratio: 14 / 9;
  overflow: hidden;
}

.gallery-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-empty {
  padding: 6rem 0;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
