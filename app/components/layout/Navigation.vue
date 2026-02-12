<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const links = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/#etudes', label: t('nav.projects') },
  { to: '/gallery', label: t('nav.gallery') },
])

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <nav>
    <ul class="nav-list">
      <li v-for="link in links" :key="link.to">
        <NuxtLink
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link--active': isActive(link.to) }"
        >
          {{ link.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav-list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.125rem 0.25rem;
  border-radius: 0.125rem;
  transition: color 0.15s, background-color 0.15s;
}

.nav-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.nav-link:not(.nav-link--active):hover {
  background-color: var(--color-bg-accent-hover);
}

.nav-link--active {
  background-color: var(--color-bg-accent);
  color: var(--color-accent);
}
</style>
