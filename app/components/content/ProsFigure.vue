<script setup lang="ts">
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  caption: { type: String, default: '' },
})

const isVideo = computed(() => /\.(webm|mp4|mov)$/i.test(props.src))
</script>

<template>
  <figure>
    <video v-if="isVideo" :src="src" :aria-label="alt" autoplay loop muted playsinline />
    <NuxtImg v-else-if="src" :src="src" :alt="alt" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
    <slot mdc-unwrap="p" />
  </figure>
</template>

<style scoped>
figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

figure img,
figure video {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  margin: 0;
}

figcaption {
  font-size: 0.875rem;
  letter-spacing: -0.02em;
  color: var(--color-text-muted);
  text-align: center;
}
</style>
