<script setup lang="ts">
import { CornerUpLeft } from 'lucide-vue-next'

interface TocLink {
  id: string
  text: string
  depth: number
}

const props = defineProps<{
  to: string
  label: string
  title?: string
  toc?: TocLink[]
  persistent?: boolean
}>()

const hasSidebar = computed(() => !!(props.persistent || props.title || props.toc?.length))

function scrollToTop() {
  window.scrollTo({ top: 0 })
}

const activeId = ref('')
const hasScrolled = ref(false)

if (import.meta.client) {
  function onScroll() {
    const h1 = document.querySelector('h1')
    hasScrolled.value = !h1 || h1.getBoundingClientRect().bottom < 0

    const links = props.toc
    if (!links || links.length === 0) return

    const threshold = window.scrollY + 128
    let current = ''

    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 24
    if (atBottom) {
      current = links[links.length - 1].id
    } else {
      for (const link of links) {
        const el = document.getElementById(link.id)
        if (!el) continue
        const headingTop = el.getBoundingClientRect().top + window.scrollY
        if (threshold > headingTop) {
          current = link.id
        }
      }
    }

    activeId.value = current
  }

  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
}
</script>

<template>
  <!-- Fixed sidebar (lg+ only, when there's sidebar content) -->
  <aside v-if="hasSidebar" class="aside-sidebar">
    <NuxtLink :to="to" class="back-link">
      <CornerUpLeft class="back-icon" aria-hidden="true" />
      {{ label }}
    </NuxtLink>

    <nav class="aside-links" :data-scrolled="hasScrolled || undefined">
      <a v-if="title" href="#" class="aside-title" @click.prevent="scrollToTop">{{ title }}</a>

      <a
        v-for="link in toc"
        :key="link.id"
        :href="`#${link.id}`"
        class="toc-link"
        :data-active="activeId === link.id || undefined"
      >
        {{ link.text }}
      </a>
    </nav>
  </aside>

  <!-- Inline (< lg) -->
  <div class="aside-inline">
    <NuxtLink :to="to" class="back-link">
      <CornerUpLeft class="back-icon" aria-hidden="true" />
      {{ label }}
    </NuxtLink>
  </div>
</template>

<style scoped>
/* ── Sidebar (fixed, 72rem+) ── */
.aside-sidebar {
  display: none;
}

@media (min-width: 74rem) {
  .aside-sidebar {
    display: flex;
    position: fixed;
    left: 5rem;
    top: 5rem;
    width: 10rem;
    flex-direction: column;
    gap: 2rem;
  }
}

/* ── Inline (< 72rem) ── */
.aside-inline {
  display: flex;
  align-items: center;
}

@media (min-width: 74rem) {
  .aside-inline {
    display: none;
  }
}

/* ── Back link ── */
.back-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  letter-spacing: -0.04em;
  color: var(--color-text-muted);
  transition: color 0.15s;
}

.back-link:hover {
  color: var(--color-text-muted-hover);
}

.back-icon {
  width: 1rem;
  height: 1rem;
}

/* ── Links section ── */
.aside-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.aside-title {
  font-size: 0.875rem;
  letter-spacing: -0.04em;
  color: var(--color-text);
  padding-bottom: 0.5rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.aside-links[data-scrolled] .aside-title {
  opacity: 1;
  pointer-events: auto;
}

.toc-link {
  font-size: 0.875rem;
  letter-spacing: -0.04em;
  color: var(--color-text-muted);
  transition: color 0.15s;
}

.toc-link:hover {
  color: var(--color-accent) !important;
}

.toc-link[data-active] {
  color: var(--color-text);
}

.toc-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 0.125rem;
}
</style>
