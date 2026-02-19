<template>
  <span class="tag"><slot /></span>
</template>

<style scoped>
.tag {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.01em;
  padding: 0.25rem 0.625rem;
  background-color: var(--color-bg-subtle);
  border-radius: 1rem;
  color: var(--color-text-muted);
}
</style>
