<script setup lang="ts">
const props = defineProps({
  to: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  component: { type: String },
  cover: { type: String },
})

const isVideo = computed(() =>
  props.cover ? /\.(mp4|webm|mov)$/i.test(props.cover) : false,
)
</script>

<template>
  <article class="craft-card">
    <NuxtLink :to="to" class="craft-card-link">
      <div class="craft-card-preview">
        <component
          v-if="component"
          :is="component"
          class="craft-card-demo"
        />
        <video
          v-else-if="cover && isVideo"
          :src="cover"
          class="craft-card-cover"
          autoplay
          loop
          muted
          playsinline
        />
        <NuxtImg
          v-else-if="cover"
          :src="cover"
          :alt="title"
          class="craft-card-cover"
          loading="lazy"
        />
      </div>
      <div class="craft-card-info">
        <h3 class="craft-card-title">{{ title }}</h3>
        <p class="craft-card-meta">
          {{ formatDate(date) }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.craft-card {
  position: relative;
}

.craft-card-link {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.craft-card-preview {
  aspect-ratio: 14 / 9;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  background-color: var(--color-bg-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
}

.craft-card:hover .craft-card-preview {
  border-color: var(--color-text-muted);
}

.craft-card-demo {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.craft-card-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.craft-card:hover .craft-card-cover {
  transform: scale(1.03);
}

.craft-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.craft-card-title {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  transition: color 0.15s;
}

.craft-card:hover .craft-card-title {
  color: var(--color-text-hover);
}

.craft-card-meta {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
