<script setup lang="ts">
import { ref } from 'vue'

const liked = ref(false)
const sent = ref(false)

function handleSend() {
  sent.value = true
  setTimeout(() => {
    sent.value = false
  }, 2000)
}
</script>

<template>
  <div class="button-demo">
    <button
      class="demo-btn demo-btn--primary"
      :class="{ 'demo-btn--liked': liked }"
      @click="liked = !liked"
    >
      {{ liked ? '♥ Liked' : '♡ Like' }}
    </button>

    <button
      class="demo-btn demo-btn--send"
      :class="{ 'demo-btn--sent': sent }"
      :disabled="sent"
      @click="handleSend"
    >
      <span class="demo-btn-label">{{ sent ? '✓ Sent' : 'Send' }}</span>
    </button>

    <button class="demo-btn demo-btn--ghost">
      Hover me
    </button>
  </div>
</template>

<style scoped>
.button-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  flex-wrap: wrap;
}

.demo-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.demo-btn:active {
  transform: scale(0.97);
}

.demo-btn--primary {
  background-color: var(--color-bg-foreground);
}

.demo-btn--liked {
  background-color: var(--color-bg-accent);
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.demo-btn--send {
  background-color: var(--color-bg-foreground);
}

.demo-btn--sent {
  background-color: var(--color-bg-accent);
  color: var(--color-accent);
  border-color: var(--color-accent);
  cursor: default;
}

.demo-btn--sent:active {
  transform: none;
}

.demo-btn--ghost {
  background-color: transparent;
  border-color: transparent;
}

.demo-btn--ghost:hover {
  background-color: var(--color-bg-foreground);
  border-color: var(--color-border);
}

.demo-btn-label {
  display: inline-block;
  transition: transform 0.2s ease;
}
</style>
