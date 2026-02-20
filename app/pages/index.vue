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

const { data: craftItems } = await useAsyncData('featured-craft', () =>
  queryCollection('craft')
    .where('featured', '=', true)
    .order('date', 'DESC')
    .limit(3)
    .all()
)

const { data: galleryImages } = await useAsyncData('home-gallery', () =>
  queryCollection('gallery')
    .limit(4)
    .all()
)

const {
  activeFilter, filterTabs, displayedCraftItems, displayedGalleryItems, displayedCount, slideDirection,
} = useCraftFilter(craftItems, galleryImages, 'home')

useSeoMeta({
  title: t('home.seo.title'),
  description: t('home.seo.description'),
  ogImage: '/images/avatar.png',
})
</script>

<template>
  <!-- Bio -->
  <section class="bio">
    <h1 class="sr-only">{{ t('home.name') }} — {{ t('home.title') }}</h1>

    <h2 class="bio-headline">
      {{ t('home.bio.headline') }}<span class="cursor">_</span>
    </h2>
    <p>
      <i18n-t keypath="home.bio.body" tag="span">
        <template #vueLink>
          <UiSmartLink href="https://vuejs.org">Vue.js</UiSmartLink>
        </template>
        <template #nuxtLink>
          <UiSmartLink href="https://nuxt.com">Nuxt</UiSmartLink>
        </template>
        <template #agencyLink>
          <UiSmartLink href="https://revemieux.fr">{{ t('home.bio.agencyName') }}</UiSmartLink>
        </template>
      </i18n-t>
    </p>
    <p>
      <i18n-t keypath="home.bio.background" tag="span">
        <template #capgeminiLink>
          <UiSmartLink href="https://www.capgemini.com">{{ t('home.bio.capgeminiName') }}</UiSmartLink>
        </template>
      </i18n-t>
    </p>
    <p>{{ t('home.bio.today') }}</p>
    <p>
      <i18n-t keypath="home.bio.contact" tag="span">
        <template #emailLink>
          <a href="mailto:alexandre@revemieux.fr" class="link">alexandre@revemieux.fr</a>
        </template>
        <template #linkedinLink>
          <a href="https://www.linkedin.com/in/alexandre-brondel/" target="_blank" rel="noopener noreferrer" class="link">@alexbrndl</a>
        </template>
      </i18n-t>
    </p>
    <span class="status-pill">
      <span class="status-dot"></span>
      {{ t('home.status') }}
    </span>
  </section>

  <!-- Études (projects) -->
  <section v-if="projects?.length" id="etudes" class="section">
    <h2 class="section-label">{{ t('home.studies') }}<UiTag>01</UiTag></h2>

    <UiStudyCard
      v-for="project in projects"
      :key="project.path"
      :to="`/${project.stem}`"
      :title="project.title"
      :meta="`${formatDate(project.date)}`"
      :cover="project.cover"
      :url="project.url ?? ''"
      :tags="project.tags ?? []"
    />
  </section>

  <!-- Craft + Gallery -->
  <section v-if="craftItems?.length || galleryImages?.length" id="craft" class="section">
    <NuxtLink to="/craft" class="section-header">
      <h2 class="section-label">{{ t('home.craft') }}<UiTag>
            <Transition :name="slideDirection">
              <span :key="activeFilter">{{ String(displayedCount).padStart(2, '0') }}</span>
            </Transition>
          </UiTag></h2>
      <span class="section-more link">
        {{ t('home.viewMore') }}
        <ArrowDownRight class="section-more-icon" aria-hidden="true" />
      </span>
    </NuxtLink>

    <UiClipTabs v-model="activeFilter" :tabs="filterTabs" />

    <Transition name="grid" mode="out-in">
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
  </section>

</template>

<style scoped>
.bio {
  color: var(--color-text-muted);
}

.bio-headline {
  font-size: inherit;
  font-weight: 600;
  color: var(--color-text);
}

.bio p + p,
.bio h2 + p {
  margin-top: 1rem;
}

.cursor {
  font-family: var(--font-mono);
  color: var(--color-malachite-500);
  animation: blink 1500ms step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 1rem;
  background-color: var(--color-bg-accent);
  color: var(--color-accent);
  margin-top: 1rem;
}

.status-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background-color: var(--color-accent);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-margin-top: 2rem;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: normal;
  color: var(--color-text-muted);
}

.section > .section-label {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.section-more {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  background-size: 100% 0px;
}

.section-header:hover .section-more {
  background-size: 100% 100%;
}

.section-more-icon {
  width: 1rem;
  height: 1rem;
}

</style>
