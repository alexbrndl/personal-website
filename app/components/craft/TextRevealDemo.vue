<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const words = ['design', 'craft', 'motion', 'detail']
const currentIndex = ref(0)
const isVisible = ref(true)
let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    isVisible.value = false
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % words.length
      isVisible.value = true
    }, 400)
  }, 2400)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="text-reveal-demo">
    <p class="text-reveal-sentence">
      Obsessed with
      <span class="text-reveal-word-wrapper">
        <span class="text-reveal-word" :class="{ 'is-visible': isVisible }">
          {{ words[currentIndex] }}
        </span>
      </span>
    </p>
  </div>
</template>

<style scoped>
.text-reveal-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
}

.text-reveal-sentence {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.04em;
  color: var(--color-text-muted);
}

.text-reveal-word-wrapper {
  display: inline-block;
  position: relative;
  min-width: 5ch;
}

.text-reveal-word {
  display: inline-block;
  color: var(--color-accent);
  transition: opacity 0.4s ease, transform 0.4s ease, filter 0.4s ease;
}

.text-reveal-word:not(.is-visible) {
  opacity: 0;
  transform: translateY(6px);
  filter: blur(4px);
}

.text-reveal-word.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
</style>
