<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

const { t } = useI18n()
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () =>
  queryCollection('projects')
    .where('stem', '=', `projects/${route.params.slug}`)
    .first()
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const toc = computed(() => {
  if (!project.value?.body?.toc?.links) return []
  return project.value.body.toc.links
})

const projectDomain = computed(() => {
  if (!project.value?.url) return null
  try {
    return new URL(project.value.url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
})

useSeoMeta({
  title: `${project.value.title} - Alexandre Brondel`,
  description: project.value.description,
  ogImage: project.value.cover,
})
</script>

<template>
  <LayoutAside
    to="/"
    :label="t('project.backToIndex')"
    :title="project?.title"
    :toc="toc"
  />

  <section v-if="project" class="project-section">
    <div class="project-info">
      <div class="project-header">
        <h1 class="project-title">{{ project.title }}</h1>
        <p class="project-meta">
          {{ project.client ?? project.role }} · {{ formatDate(project.date) }}
          <template v-if="project.url">· </template>
          <a
            v-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="project-url link"
          >
            {{ projectDomain }}
            <ArrowUpRight class="project-url-icon" aria-hidden="true" />
          </a>
        </p>
        <div v-if="project.tags?.length" class="project-tags">
          <UiTag v-for="tag in project.tags" :key="tag">{{ tag }}</UiTag>
        </div>
      </div>

      <ProsFigure
        :src="project.cover"
        :alt="project.title"
        :caption="project.description"
      />
    </div>

    <div class="prose">
      <ContentRenderer :value="project" />
    </div>
  </section>
</template>

<style scoped>
.project-section {
  display: flex;
  flex-direction: column;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.project-url {
  display: inline-flex;
  align-items: center;
}

.project-url:hover {
  color: var(--color-text-muted-hover);
}

.project-url-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
</style>
