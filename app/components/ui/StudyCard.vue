<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

const props = defineProps({
  to: { type: String, required: true },
  title: { type: String, required: true },
  meta: { type: String, required: true },
  cover: { type: String, required: true },
  url: { type: String, default: '' },
  tags: { type: Array as () => string[], default: () => [] },
})

const domain = computed(() => props.url ? extractDomain(props.url) : null)
</script>

<template>
  <article class="study-card">
    <div class="study-card-layout">
      <div class="study-card-cover-wrapper">
        <NuxtImg
          :src="cover"
          :alt="title"
          class="study-card-cover"
        />
      </div>
      <div class="study-card-content">
        <h3 class="study-card-title">
          <NuxtLink :to="to">{{ title }}</NuxtLink>
        </h3>
        <p class="study-card-meta">
          {{ meta }}
          <template v-if="url">·</template>
          <a
            v-if="url"
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="study-card-url link"
          >
            {{ domain }}
            <ArrowUpRight class="study-card-url-icon" aria-hidden="true" />
          </a>
        </p>
        <div v-if="tags.length" class="study-card-tags">
          <UiTag v-for="tag in tags" :key="tag">{{ tag }}</UiTag>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.study-card {
  position: relative;
  padding: 0.5rem;
  margin: 0 -0.5rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease-in-out;
}

.study-card:hover {
  background-color: var(--color-bg-subtle-hover);
}

.study-card-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.study-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.study-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.study-card-title a {
  transition: color 0.15s;
}

.study-card-title a::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
}

.study-card-title a:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.study-card:hover .study-card-title a {
  color: var(--color-text-hover);
}

.study-card-meta {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.study-card-url {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
}

.study-card-url-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.study-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}


.study-card-cover-wrapper {
  aspect-ratio: 14 / 9;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.study-card-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

@media (max-width: 640px) {
  .study-card-layout {
    grid-template-columns: 1fr;
  }
}

.study-card:hover .study-card-cover {
  transform: scale(1.02);
}
</style>
