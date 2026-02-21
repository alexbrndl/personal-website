<script setup lang="ts">
import gsap from 'gsap'
import type { CraftComponentName } from '~/utils/craft-components'
import AnimatingIcons from '~/components/craft/AnimatingIcons.vue'
import ButtonMicro from '~/components/craft/ButtonMicro.vue'
import ClipTabsDemo from '~/components/craft/ClipTabsDemo.vue'
import FloatingToolbar from '~/components/craft/FloatingToolbar.vue'

const componentMap: Record<CraftComponentName, Component> = {
  AnimatingIcons,
  ButtonMicro,
  ClipTabsDemo,
  FloatingToolbar,
}

const props = defineProps<{
  is: CraftComponentName
  legend?: string
  variant?: string
  showSlow?: boolean
}>()

const resolvedComponent = computed(() => componentMap[props.is])

const controlsEl = ref<HTMLElement>()
provide('craft-demo-controls-el', controlsEl)

const slow = useState('craft-demo-slow', () => false)

function toggleSlow() {
  slow.value = !slow.value
  gsap.globalTimeline.timeScale(slow.value ? 0.2 : 1)
}

onUnmounted(() => {
  if (slow.value) {
    gsap.globalTimeline.timeScale(1)
  }
})
</script>

<template>
  <figure class="craft-demo">
    <div class="craft-demo-frame">
      <div ref="controlsEl" class="craft-demo-controls">
        <button v-if="showSlow" class="craft-demo-btn" @click="toggleSlow">
          <span class="craft-demo-btn-swap">
            <span :class="{ active: slow }">x0.2</span>
            <span :class="{ active: !slow }">x1</span>
          </span>
        </button>
      </div>
      <div class="craft-demo-content">
        <component :is="resolvedComponent" :variant="variant" />
      </div>
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
  position: relative;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-subtle);
  overflow: hidden;
  /* Reset inherited .prose styles */
  color: var(--color-text);
  line-height: normal;
  letter-spacing: -0.02em;
  text-wrap: wrap;
}

.craft-demo-controls {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  display: flex;
  flex-direction: row-reverse;
  gap: 0.5rem;
}

.craft-demo-controls:not(:has(button)) {
  display: none;
}

.craft-demo-content {
  padding: 2.5rem 1rem;
}

.craft-demo-frame:has(.craft-demo-controls button) .craft-demo-content {
  padding-block: 4rem;
}

.craft-demo-controls :deep(.craft-demo-btn) {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  cursor: pointer;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-subtle);
  color: var(--color-text-muted);
  transition: background-color 0.15s ease;
}

.craft-demo-controls :deep(.craft-demo-btn:hover) {
  background-color: var(--color-bg-subtle-hover);
}

.craft-demo-controls :deep(.craft-demo-btn-swap) {
  display: grid;
}

.craft-demo-controls :deep(.craft-demo-btn-swap > *) {
  grid-area: 1 / 1;
  opacity: 0;
  scale: 0.25;
  filter: blur(4px);
  transition: opacity 0.3s ease,
              scale 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.3s ease;
}

.craft-demo-controls :deep(.craft-demo-btn-swap > .active) {
  opacity: 1;
  scale: 1;
  filter: none;
}

.craft-demo-legend {
  font-size: 0.875rem;
  letter-spacing: -0.04em;
  color: var(--color-text-muted);
  text-align: center;
}
</style>
