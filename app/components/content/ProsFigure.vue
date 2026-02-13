<script setup lang="ts">
withDefaults(defineProps<{
  src?: string
  alt?: string
  caption?: string
}>(), {
  src: '',
  alt: '',
  caption: '',
})
</script>

<template>
  <figure>
    <NuxtImg v-if="src" :src="src" :alt="alt" />
    <figcaption v-if="caption">{{ caption }}</figcaption>
    <slot mdc-unwrap="p" />
  </figure>
</template>
