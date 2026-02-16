<script setup lang="ts">
const { t } = useI18n()

const { data: projects, error } = await useAsyncData('all-projects', () =>
  queryCollection('projects')
    .order('date', 'DESC')
    .all()
)

if (error.value) {
  console.error('Failed to fetch projects:', error.value)
}

useSeoMeta({
  title: t('project.seo.title'),
  description: t('project.seo.description'),
})
</script>

<template>
  <LayoutAside to="/" :label="t('project.backToIndex')" />

  <section class="projects-list">
    <h1 class="section-label">{{ t('home.studies') }}</h1>
    <StudyCard
      v-for="project in projects"
      :key="project.path"
      :to="`/${project.stem}`"
      :title="project.title"
      :meta="`${project.client ?? project.role} · ${formatDate(project.date)}`"
      :description="project.description"
      :cover="project.cover"
    />
  </section>
</template>

<style scoped>
.section-label {
  font-size: inherit;
  font-weight: inherit;
  color: var(--color-text-muted);
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
