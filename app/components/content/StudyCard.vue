<script setup lang="ts">
defineProps<{
  to: string
  title: string
  meta: string
  description: string
  cover: string
}>()
</script>

<template>
  <article class="study-card">
    <div class="study-card-header">
      <div class="study-card-info">
        <NuxtLink :to="to" class="study-card-title">
          {{ title }}
        </NuxtLink>
        <p class="study-card-meta">{{ meta }}</p>
      </div>
      <p class="study-card-desc">
        {{ description }}
      </p>
    </div>

    <NuxtLink :to="to">
      <NuxtImg
        :src="cover"
        :alt="title"
        class="study-card-cover"
      />
    </NuxtLink>
  </article>
</template>

<style scoped>
.study-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid var(--color-border);
  padding: 0.75rem 0;
}

.study-card-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .study-card-header {
    flex-direction: row;
    align-items: flex-start;
  }
}

.study-card-info {
  flex: 1;
}

.study-card-title {
  font-size: 1.5rem;
  line-height: 2rem;
  transition: color 0.15s;
}

.study-card-title:hover {
  color: var(--color-text-hover);
}

.study-card-meta {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.study-card-desc {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

@media (min-width: 640px) {
  .study-card-desc {
    max-width: 24rem;
  }
}

.study-card-cover {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  object-fit: cover;
  aspect-ratio: 14 / 9;
}
</style>
