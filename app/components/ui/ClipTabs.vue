<script setup lang="ts">
import { TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import type { Component } from 'vue'

interface Tab {
  value: string
  label: string
  icon?: Component
}

defineProps<{
  tabs: Tab[]
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <TabsRoot v-model="model">
    <TabsList class="clip-tabs-list">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="clip-tabs-trigger"
      >
        <component :is="tab.icon" v-if="tab.icon" class="clip-tabs-icon" aria-hidden="true" />
        {{ tab.label }}
      </TabsTrigger>

      <TabsIndicator as-child>
        <div class="clip-tabs-overlay" aria-hidden="true">
          <div class="clip-tabs-overlay-list">
            <span
              v-for="tab in tabs"
              :key="tab.value"
              class="clip-tabs-trigger"
            >
              <component :is="tab.icon" v-if="tab.icon" class="clip-tabs-icon" />
              {{ tab.label }}
            </span>
          </div>
        </div>
      </TabsIndicator>
    </TabsList>
  </TabsRoot>
</template>

<style scoped>
.clip-tabs-list {
  position: relative;
  display: flex;
  gap: 0.375rem;
  width: fit-content;
}

.clip-tabs-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  letter-spacing: -0.02em;
  padding: 0.25rem 0.625rem;
  border-radius: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: color 0.25s ease, background-color 0.25s ease;
}

.clip-tabs-trigger:hover {
  color: var(--color-text);
  background-color: var(--color-bg-hover);
}

.clip-tabs-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.clip-tabs-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: clip-path 0.25s ease;
  clip-path: inset(
    0
    calc(100% - var(--reka-tabs-indicator-position, 0px) - var(--reka-tabs-indicator-size, 0px))
    0
    var(--reka-tabs-indicator-position, 0px)
    round 1rem
  );
}

.clip-tabs-overlay-list {
  display: flex;
  gap: 0.375rem;
  background-color: var(--color-bg-accent);
}

.clip-tabs-overlay-list .clip-tabs-trigger {
  color: var(--color-accent);
}
</style>
