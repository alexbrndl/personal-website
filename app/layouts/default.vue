<template>
  <div class="gradient-fade" />
  <div class="layout">
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
  gap: 1rem;
  padding-inline: 1rem;
  padding-block: 5rem;
}

.layout-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3rem;
}

@media (min-width: 74rem) {
  .layout {
    gap: 3rem;
  }
}
</style>
