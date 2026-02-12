<script setup lang="ts">
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
        </p>
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

    <div class="prose prose-project">
      <ContentRenderer :value="project" />
    </div>
  </section>
</template>

<style scoped>
.project-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-title {
  font-size: 1.25rem;
  letter-spacing: -0.04em;
}

.project-meta {
  font-size: 0.875rem;
  letter-spacing: -0.04em;
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
  font-size: 0.875rem;
  letter-spacing: -0.04em;
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
