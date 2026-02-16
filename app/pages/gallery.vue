<script setup lang="ts">
const { t } = useI18n()

const { data: images, error } = await useAsyncData('gallery-images', () =>
  queryCollection('gallery')
    .all()
)

if (error.value) {
  console.error('Failed to fetch gallery images:', error.value)
}

useSeoMeta({
  title: t('gallery.seo.title'),
  description: t('gallery.seo.description'),
  ogImage: '/images/avatar.png',
})
</script>

<template>
  <LayoutAside to="/" :label="t('gallery.backToIndex')" persistent />

  <section class="section">
    <h1 class="section-label">{{ t('gallery.title') }}</h1>

    <div class="gallery-stack">
      <figure
        v-for="img in images"
        :key="img.id"
        class="gallery-item"
      >
        <NuxtImg
          :src="img.src"
          :alt="img.alt"
          class="gallery-item-img"
          loading="lazy"
        />
        <figcaption v-if="img.description" class="gallery-item-caption">
          {{ img.description }}
        </figcaption>
      </figure>
    </div>

    <div v-if="!images?.length" class="gallery-empty">
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
  font-size: inherit;
  font-weight: inherit;
  color: var(--color-text-muted);
}

.gallery-stack {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.gallery-item-img {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.gallery-item-caption {
  font-size: 0.875rem;
  letter-spacing: -0.04em;
  color: var(--color-text-muted);
  text-align: center;
}

.gallery-empty {
  padding: 6rem 0;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
