<script setup lang="ts">
import { MousePointerClick, Image } from 'lucide-vue-next'

const { t } = useI18n()

const { data: items, error } = await useAsyncData('all-craft', () =>
  queryCollection('craft')
    .order('date', 'DESC')
    .all()
)

if (error.value) {
  console.error('Failed to fetch craft items:', error.value)
}

const { data: galleryImages } = await useAsyncData('all-gallery', () =>
  queryCollection('gallery')
    .all()
)

const activeFilter = ref('all')

const displayedCraftItems = computed(() =>
  activeFilter.value === 'visual' ? [] : (items.value ?? [])
)

const displayedGalleryItems = computed(() =>
  activeFilter.value === 'interactive' ? [] : (galleryImages.value ?? [])
)

const displayedCount = computed(() =>
  displayedCraftItems.value.length + displayedGalleryItems.value.length
)

const hasContent = computed(() =>
  (items.value?.length ?? 0) > 0 || (galleryImages.value?.length ?? 0) > 0
)

useSeoMeta({
  title: t('craft.seo.title'),
  description: t('craft.seo.description'),
})
</script>

<template>
  <LayoutAside to="/" :label="t('craft.backToIndex')" persistent />

  <section class="section">
    <h1 class="section-label">
      {{ t('craft.title') }}
      <UiTag>{{ String(displayedCount).padStart(2, '0') }}</UiTag>
    </h1>

    <div class="filters">
      <button
        :class="['filter-pill', { 'filter-pill--active': activeFilter === 'all' }]"
        @click="activeFilter = 'all'"
      >
        {{ t('craft.filterAll') }}
      </button>
      <button
        :class="['filter-pill', { 'filter-pill--active': activeFilter === 'interactive' }]"
        @click="activeFilter = 'interactive'"
      >
        <MousePointerClick class="filter-pill-icon" aria-hidden="true" />
        {{ t('craft.filterInteractive') }}
      </button>
      <button
        :class="['filter-pill', { 'filter-pill--active': activeFilter === 'visual' }]"
        @click="activeFilter = 'visual'"
      >
        <Image class="filter-pill-icon" aria-hidden="true" />
        {{ t('craft.filterVisual') }}
      </button>
    </div>

    <Transition v-if="hasContent" name="grid" mode="out-in">
      <div :key="activeFilter" class="craft-grid">
        <UiCraftCard
          v-for="item in displayedCraftItems"
          :key="item.path"
          :to="`/${item.stem}`"
          :title="item.title"
          :date="item.date"
          :component="item.component"
          :cover="item.cover"
        />
        <div
          v-for="img in displayedGalleryItems"
          :key="img.id"
          class="gallery-card"
        >
          <div class="gallery-card-preview">
            <NuxtImg
              :src="img.src"
              :alt="img.alt"
              loading="lazy"
              class="gallery-card-img"
            />
          </div>
          <p v-if="img.description" class="gallery-card-caption">{{ img.description }}</p>
        </div>
      </div>
    </Transition>

    <div v-else class="craft-empty">
      <p>{{ t('craft.empty') }}</p>
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: normal;
  color: var(--color-text-muted);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.filters {
  display: flex;
  gap: 0.375rem;
}

.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  background-color: transparent;
  color: var(--color-text-muted);
}

.filter-pill:hover {
  color: var(--color-text);
}

.filter-pill--active {
  background-color: var(--color-bg-accent);
  color: var(--color-accent);
}

.filter-pill-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.craft-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .craft-grid {
    grid-template-columns: 1fr;
  }
}

/* Filter transition */
.grid-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.grid-leave-active {
  transition: opacity 0.15s ease;
}

.grid-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.grid-leave-to {
  opacity: 0;
}

.gallery-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gallery-card-preview {
  aspect-ratio: 14 / 9;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  transition: border-color 0.3s;
}

.gallery-card:hover .gallery-card-preview {
  border-color: var(--color-text-muted);
}

.gallery-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.gallery-card:hover .gallery-card-img {
  transform: scale(1.03);
}

.gallery-card-caption {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.craft-empty {
  padding: 6rem 0;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
