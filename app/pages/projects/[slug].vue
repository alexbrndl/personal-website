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
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
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
          <template v-if="project.url">·</template>
          <a
            v-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="project-url"
          >
            {{ projectDomain }}
            <ArrowUpRight class="project-url-icon" />
          </a>
        </p>
        <div v-if="project.tags?.length" class="project-tags">
          <span v-for="tag in project.tags" :key="tag" class="project-tag">{{ tag }}</span>
        </div>
      </div>

      <div class="project-details">
        <p class="project-desc">
          {{ project.description }}
        </p>
        <div class="project-cover-wrapper">
          <NuxtImg
            :src="project.cover"
            :alt="project.title"
            class="project-cover"
          />
        </div>
      </div>
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
  gap: 0.5rem;
}

.project-title {
  font-size: 1.25rem;
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
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.15s;
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

.project-tag {
  font-size: 0.875rem;
  padding: 0.125rem 0.5rem;
  background-color: var(--color-bg-foreground);
  border-radius: 1rem;
  color: var(--color-text-muted);
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .project-details {
    flex-direction: row;
  }
}

.project-desc {
  flex: 1;
  font-size: 1rem;
  color: var(--color-text-muted);
}

.project-cover-wrapper {
  flex: 1;
  aspect-ratio: 14 / 9;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.project-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
