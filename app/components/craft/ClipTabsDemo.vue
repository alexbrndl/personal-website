<script setup lang="ts">
import { TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import type { Ref } from 'vue'

const { variant } = defineProps<{
  variant?: string
}>()

const tabs = [
  { value: 'design', label: 'Design' },
  { value: 'code', label: 'Code' },
  { value: 'preview', label: 'Preview' },
]

const activeTab = ref('design')
const showLayers = ref(false)
const slow = useState('craft-demo-slow', () => false)
const controlsEl = inject<Ref<HTMLElement | undefined>>('craft-demo-controls-el')
</script>

<template>
  <div class="clip-tabs-demo" :class="{ 'clip-tabs-demo--slow': slow }">
    <!-- Classic: class toggle -->
    <div v-if="variant === 'classic'" class="tabs-list">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-trigger"
        :class="{ 'tab-trigger--active': activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Default: clip-path -->
    <template v-else>
      <TabsRoot v-model="activeTab">
        <TabsList class="tabs-list" :class="{ 'tabs-list--exploded': showLayers }">
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            class="tab-trigger"
          >
            {{ tab.label }}
          </TabsTrigger>

          <TabsIndicator as-child>
            <div
              class="tabs-overlay"
              :class="{ 'tabs-overlay--exploded': showLayers }"
              aria-hidden="true"
            >
              <div class="tabs-overlay-list">
                <span
                  v-for="tab in tabs"
                  :key="tab.value"
                  class="tab-trigger"
                >
                  {{ tab.label }}
                </span>
              </div>
            </div>
          </TabsIndicator>
        </TabsList>
      </TabsRoot>
    </template>

    <Teleport v-if="variant === 'layers' && controlsEl" :to="controlsEl">
      <button class="craft-demo-btn" @click="showLayers = !showLayers">
        <span class="craft-demo-btn-swap">
          <span :class="{ active: showLayers }">⊟ Couches</span>
          <span :class="{ active: !showLayers }">⊞ Couches</span>
        </span>
      </button>
    </Teleport>
  </div>
</template>

<style scoped>
.clip-tabs-demo {
  --transition-duration: 0.25s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.clip-tabs-demo--slow {
  --transition-duration: 1.25s;
}

.tabs-list {
  position: relative;
  display: flex;
  gap: 0.375rem;
  width: fit-content;
  transition: margin-bottom var(--transition-duration) ease;
}

.tabs-list--exploded {
  margin-bottom: 2.5rem;
}

.tab-trigger {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  letter-spacing: -0.02em;
  padding: 0.25rem 0.625rem;
  border-radius: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: color var(--transition-duration) ease, background-color var(--transition-duration) ease;
}

.tab-trigger:hover {
  color: var(--color-text);
  background-color: var(--color-bg-hover);
}

/* Classic variant */

.tab-trigger--active {
  background-color: var(--color-bg-accent);
  color: var(--color-accent);
}

/* Clip-path variant */

.tabs-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: clip-path var(--transition-duration) ease, transform 0.3s ease;
  clip-path: inset(
    0
    calc(100% - var(--reka-tabs-indicator-position, 0px) - var(--reka-tabs-indicator-size, 0px))
    0
    var(--reka-tabs-indicator-position, 0px)
    round 1rem
  );
}

.tabs-overlay--exploded {
  transform: translateY(calc(100% + 0.5rem));
}

.tabs-overlay-list {
  display: flex;
  gap: 0.375rem;
  background-color: var(--color-bg-accent);
}

.tabs-overlay-list .tab-trigger {
  color: var(--color-accent);
}
</style>
