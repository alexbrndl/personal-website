<script setup lang="ts">
import gsap from 'gsap'
import type { CraftComponentName } from '~/utils/craft-components'
import ButtonMicro from '~/components/craft/ButtonMicro.vue'
import TextRevealDemo from '~/components/craft/TextRevealDemo.vue'

const componentMap: Record<CraftComponentName, Component> = {
  ButtonMicro,
  TextRevealDemo,
}

const props = defineProps<{
  is: CraftComponentName
  legend?: string
  variant?: string
  showSlow?: boolean
}>()

const resolvedComponent = computed(() => componentMap[props.is])

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
      <button v-if="showSlow" class="craft-demo-slow" @click="toggleSlow">
        {{ slow ? '🐢 Slow (×5)' : '▶ Normal' }}
      </button>
      <component :is="resolvedComponent" :variant="variant" />
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
  background-color: var(--color-bg-backdrop);
  overflow: hidden;
  /* Reset inherited .prose styles */
  color: var(--color-text);
  line-height: normal;
  letter-spacing: -0.02em;
  text-wrap: wrap;
}

.craft-demo-slow {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  cursor: pointer;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-foreground);
  color: var(--color-text-muted);
  transition: background-color 0.15s ease;
}

.craft-demo-slow:hover {
  background-color: var(--color-bg-foreground-hover);
}

.craft-demo-legend {
  font-size: 0.875rem;
  letter-spacing: -0.04em;
  color: var(--color-text-muted);
  text-align: center;
}
</style>
