<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

const props = defineProps({
  to: { type: String, required: true },
  title: { type: String, required: true },
  meta: { type: String, required: true },
  description: { type: String, required: true },
  cover: { type: String, required: true },
  url: { type: String, default: '' },
  tags: { type: Array as () => string[], default: () => [] },
})

const domain = computed(() => {
  if (!props.url) return null
  try {
    return new URL(props.url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
})
</script>

<template>
  <article class="study-card">
    <div class="study-card-info">
      <div class="study-card-header">
        <NuxtLink :to="to" class="study-card-title">
          {{ title }}
        </NuxtLink>
        <p class="study-card-meta">
          {{ meta }}
          <template v-if="url">·</template>
          <a
            v-if="url"
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="study-card-url"
          >
            {{ domain }}
            <ArrowUpRight class="study-card-url-icon" aria-hidden="true" />
          </a>
        </p>
        <div v-if="tags.length" class="study-card-tags">
          <span v-for="tag in tags" :key="tag" class="study-card-tag">{{ tag }}</span>
        </div>
      </div>

      <div class="study-card-details">
        <p class="study-card-desc">
          {{ description }}
        </p>
        <div class="study-card-cover-wrapper">
          <NuxtImg
            :src="cover"
            :alt="title"
            class="study-card-cover"
          />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.study-card {
  position: relative;
  border-top: 1px solid var(--color-border);
  padding: 0.75rem 0;
  transition: border-color 0.3s;
}

.study-card:hover {
  border-color: var(--color-text-muted);
}

.study-card-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.study-card-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.study-card-title {
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  transition: color 0.15s;
  font-weight: 600;
}

.study-card-title::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
}

.study-card-title:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.study-card:hover .study-card-title {
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
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.15s;
}

.study-card-url:hover {
  color: var(--color-text-muted-hover);
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

.study-card-tag {
  font-size: 0.875rem;
  padding: 0.125rem 0.5rem;
  background-color: var(--color-bg-foreground);
  border-radius: 1rem;
  color: var(--color-text-muted);
}

.study-card-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.study-card-desc {
  flex: 1;
  color: var(--color-text-muted);
}

.study-card-cover-wrapper {
  flex: 1;
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

.study-card:hover .study-card-cover {
  transform: scale(1.03);
}
</style>
