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
    <video v-if="isVideo" :src="src" autoplay loop muted playsinline />
    <NuxtImg v-else-if="src" :src="src" :alt="alt" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
    <slot mdc-unwrap="p" />
  </figure>
</template>
