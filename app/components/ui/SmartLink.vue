<script setup lang="ts">
const props = defineProps({
  href: { type: String, default: '' },
  label: { type: String, default: '' },
})

const domain = computed(() => {
  try {
    return new URL(props.href).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
})

const faviconUrl = computed(() => {
  if (!domain.value) return ''
  return `https://www.google.com/s2/favicons?domain=${domain.value}&sz=32`
})

const isExternal = computed(() => /^https?:\/\//.test(props.href))

const displayLabel = computed(() => props.label || domain.value)
</script>

<template>
  <a
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    class="smart-link"
  >
    <span class="smart-link-bg" />
    <img
      v-if="faviconUrl"
      :src="faviconUrl"
      alt=""
      class="smart-link-favicon"
      loading="lazy"
      width="16"
      height="16"
    />
    <slot>{{ displayLabel }}</slot>
  </a>
</template>

<style scoped>
.smart-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.125rem;
  padding-left: 1.275rem;
  margin-left: 1px;
  font-weight: 500;
  text-decoration: none;
  color: var(--color-text);
}

.smart-link:hover {
  color: var(--color-text-hover);
}

.smart-link-bg {
  position: absolute;
  width: calc(100% + 4px);
  height: 100%;
  left: -2px;
  top: 0;
  background-color: var(--color-bg-foreground);
  border-radius: 0.375rem;
  z-index: -1;
  pointer-events: none;
}

.smart-link-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--color-bg-hover);
  border-radius: inherit;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s;
}

.smart-link:hover .smart-link-bg::before {
  opacity: 1;
  transform: scale(1);
}

.smart-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.smart-link-favicon {
  position: absolute;
  left: 0.125rem;
  width: 1rem;
  height: 1rem;
  border-radius: 0.125rem;
}
</style>
