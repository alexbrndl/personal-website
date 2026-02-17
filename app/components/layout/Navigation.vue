<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const isHome = computed(() => route.path === '/')

const links = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/#etudes', label: t('nav.projects') },
  { to: isHome.value ? '/#craft' : '/craft', label: t('nav.craft') },
])

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  if (to === '/#craft') return route.path.startsWith('/craft')
  return route.path.startsWith(to)
}
</script>

<template>
  <nav>
    <ul class="nav-list">
      <li v-for="link in links" :key="link.to">
        <NuxtLink
          :to="link.to"
          class="nav-link link"
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
  gap: 0.5rem;
}

.nav-link {
  padding: 0.125rem 0.25rem;
  background-size: 100% 0px;
}

.nav-link:hover {
  background-size: 100% 100%;
}

.nav-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.nav-link--active {
  color: var(--color-accent);
  background-color: var(--color-bg-accent);
}
</style>
