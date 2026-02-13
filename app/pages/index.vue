<script setup lang="ts">
import { ArrowDownRight } from 'lucide-vue-next'

const { t } = useI18n()

const { data: projects, error } = await useAsyncData('featured-projects', () =>
  queryCollection('projects')
    .where('featured', '=', true)
    .order('date', 'DESC')
    .limit(4)
    .all()
)

if (error.value) {
  console.error('Failed to fetch featured projects:', error.value)
}

const galleryImages = computed(() => {
  if (!projects.value) return []
  const images: { src: string; alt: string; slug: string }[] = []
  for (const project of projects.value) {
    if (project.cover) {
      images.push({ src: project.cover, alt: project.title, slug: project.stem })
    }
    for (const item of project.gallery ?? []) {
      if (item.type === 'image') {
        images.push({ src: item.src, alt: item.alt ?? project.title, slug: project.stem })
      }
    }
  }
  return images.slice(0, 4)
})

useSeoMeta({
  title: t('home.seo.title'),
  description: t('home.seo.description'),
})
</script>

<template>
  <!-- Bio -->
  <section class="bio">
    <h1 class="sr-only">{{ t('home.name') }} — {{ t('home.title') }}</h1>

    <p>
      <strong>{{ t('home.bio.headline') }}</strong>
    </p>
    <p>{{ t('home.bio.intro') }}</p>
    <p>{{ t('home.bio.clients') }}</p>
    <p>
      <i18n-t keypath="home.bio.agency" tag="span">
        <template #agencyLink>
          <a href="https://revemieux.fr" target="_blank" rel="noopener noreferrer" class="bio-link">{{ t('home.bio.agencyName') }}</a>
        </template>
      </i18n-t>
    </p>
    <p>{{ t('home.bio.background') }}</p>
    <p>{{ t('home.bio.philosophy') }}</p>
    <p>{{ t('home.bio.discover') }}</p>
    <p>
      <i18n-t keypath="home.bio.contact" tag="span">
        <template #emailLink>
          <a href="mailto:alexandre@revemieux.fr" class="bio-link">alexandre@revemieux.fr</a>
        </template>
        <template #twitterLink>
          <a href="https://twitter.com/alexbrndl" target="_blank" rel="noopener noreferrer" class="bio-link">@alexbrndl</a>
        </template>
      </i18n-t>
    </p>
  </section>

  <!-- Études (projects) -->
  <section v-if="projects?.length" id="etudes" class="section">
    <p class="section-label">{{ t('home.studies') }}</p>

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

  <!-- Gallerie preview -->
  <section v-if="galleryImages.length" class="section">
    <div class="gallery-header">
      <p class="section-label">{{ t('home.gallery') }}</p>
      <NuxtLink to="/gallery" class="gallery-more">
        {{ t('home.viewMore') }}
        <ArrowDownRight class="gallery-more-icon" />
      </NuxtLink>
    </div>

    <div class="gallery-grid">
      <NuxtLink
        v-for="img in galleryImages"
        :key="`${img.slug}-${img.src}`"
        :to="`/${img.slug}`"
        :aria-label="img.alt"
        class="gallery-link"
      >
        <NuxtImg
          :src="img.src"
          :alt="img.alt"
          loading="lazy"
          class="gallery-img"
        />
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.bio p + p {
  margin-top: 1rem;
}

.bio-link {
  text-decoration: underline;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-margin-top: 2rem;
}

.section-label {
  color: var(--color-text-muted);
}

.gallery-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.gallery-more {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-timberwolf-600);
  transition: color 0.15s;
}

.gallery-more:hover {
  color: var(--color-text-hover);
}

.gallery-more-icon {
  width: 1rem;
  height: 1rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.gallery-link {
  aspect-ratio: 14 / 9;
  overflow: hidden;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.gallery-link:hover .gallery-img {
  transform: scale(1.05);
}
</style>
