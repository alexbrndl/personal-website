<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const { data: item } = await useAsyncData(`craft-${route.params.slug}`, () =>
  queryCollection('craft')
    .where('stem', '=', `craft/${route.params.slug}`)
    .first()
)

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const toc = computed(() => {
  if (!item.value?.body?.toc?.links) return []
  return item.value.body.toc.links
})

useSeoMeta({
  title: `${item.value.title} - Alexandre Brondel`,
  description: item.value.description,
})
</script>

<template>
  <LayoutAside
    to="/"
    :label="t('craft.backToIndex')"
    :title="item?.title"
    :toc="toc"
  />

  <section v-if="item" class="craft-section">
    <div class="craft-header">
      <h1 class="craft-title">{{ item.title }}</h1>
      <p class="craft-meta">
        {{ formatDate(item.date) }}
      </p>
      <div v-if="item.tags?.length" class="craft-tags">
        <UiTag v-for="tag in item.tags" :key="tag">{{ tag }}</UiTag>
      </div>
    </div>

    <div class="prose">
      <ContentRenderer :value="item" />
    </div>
  </section>
</template>

<style scoped>
.craft-section {
  display: flex;
  flex-direction: column;
}

.craft-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.craft-title {
  font-size: 1.25rem;
}

.craft-meta {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.craft-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

</style>
