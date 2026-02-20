<script setup lang="ts">
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

const {
  activeFilter, filterTabs, displayedCraftItems, displayedGalleryItems, displayedCount, slideDirection,
} = useCraftFilter(items, galleryImages, 'craft')

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
      <UiTag>
        <Transition :name="slideDirection">
          <span :key="activeFilter">{{ String(displayedCount).padStart(2, '0') }}</span>
        </Transition>
      </UiTag>
    </h1>

    <UiClipTabs v-model="activeFilter" :tabs="filterTabs" />

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

.craft-empty {
  padding: 6rem 0;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
