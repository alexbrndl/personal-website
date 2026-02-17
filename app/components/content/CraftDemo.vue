<script setup lang="ts">
import type { CraftComponentName } from '~/utils/craft-components'

defineProps<{
  is: CraftComponentName
  legend?: string
}>()
</script>

<template>
  <figure class="craft-demo">
    <div class="craft-demo-frame">
      <component :is="is" />
    </div>
    <figcaption v-if="legend" class="craft-demo-legend">
      {{ legend }}
    </figcaption>
  </figure>
</template>

<style scoped>
.craft-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.craft-demo-frame {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-foreground);
  overflow: hidden;
}

/* Isolate demos from .prose and other inherited styles */
.craft-demo-frame :deep(:where(*)) {
  all: revert;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.craft-demo-frame :deep(:where(button, input, select, textarea)) {
  font: inherit;
  color: inherit;
}

.craft-demo-legend {
  font-size: 0.875rem;
  letter-spacing: -0.04em;
  color: var(--color-text-muted);
  text-align: center;
}
</style>
