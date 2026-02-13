<script setup>
const route = useRoute()
const router = useRouter()
const noStagger = ref(!!route.hash)

const removeGuard = router.beforeEach((to) => {
  noStagger.value = !!to.hash
})
onUnmounted(() => removeGuard())
</script>

<template>
  <div class="gradient-fade" />
  <div class="layout" :class="{ 'no-stagger': noStagger, 'layout-compact': route.path !== '/' }">
    <LayoutHeader />
    <main class="layout-main">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<style>
.gradient-fade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2rem;
  background: linear-gradient(to bottom, var(--color-bg), transparent);
  pointer-events: none;
  z-index: 20;
}

.layout {
  margin-inline: auto;
  display: flex;
  min-height: 100dvh;
  max-width: var(--container-max);
  flex-direction: column;
  gap: 3rem;
  padding-inline: 1rem;
  padding-block: 5rem;
}

.layout-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3rem;
}

.layout-compact {
  gap: 1rem;
}

@media (min-width: 74rem) {
  .layout-compact {
    gap: 3rem;
  }
}
</style>
