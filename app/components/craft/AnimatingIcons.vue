<script setup lang="ts">
import { Heart } from 'lucide-vue-next'

// Props

interface Props {
  variant?: 'none' | 'opacity' | 'full'
}

const { variant } = defineProps<Props>()

// State

const levels = [
  { key: 'none', label: 'No animation' },
  { key: 'opacity', label: 'Opacity' },
  { key: 'full', label: 'Full animation' },
] as const

type Level = (typeof levels)[number]['key']

const displayedLevels = computed(() =>
  variant ? levels.filter(l => l.key === variant) : levels
)

const liked = ref<Record<Level, boolean>>({
  none: false,
  opacity: false,
  full: false,
})

const counts = ref<Record<Level, number>>({
  none: 42,
  opacity: 42,
  full: 42,
})

function toggle(level: Level) {
  liked.value[level] = !liked.value[level]
  counts.value[level] += liked.value[level] ? 1 : -1
}
</script>

<template>
  <div class="animating-icons">
    <div class="icons-row">
      <div v-for="{ key, label } in displayedLevels" :key="key" class="icon-col">
        <button
          class="like-btn"
          :class="[
            `like-btn--${key}`,
            { 'like-btn--liked': liked[key] },
          ]"
          :aria-label="liked[key] ? 'Unlike' : 'Like'"
          @click="toggle(key)"
        >
          <span class="like-btn-icon-wrapper">
            <!-- No animation: simple swap -->
            <template v-if="key === 'none'">
              <Heart
                :size="20"
                :fill="liked[key] ? 'currentColor' : 'none'"
                :stroke-width="liked[key] ? 0 : 2"
              />
            </template>

            <!-- Opacity: fade transition -->
            <template v-else-if="key === 'opacity'">
              <Transition name="fade-icon">
                <Heart
                  v-if="!liked[key]"
                  key="outline"
                  :size="20"
                  fill="none"
                  :stroke-width="2"
                />
                <Heart
                  v-else
                  key="filled"
                  :size="20"
                  fill="currentColor"
                  :stroke-width="0"
                />
              </Transition>
            </template>

            <!-- Full: opacity + scale + blur -->
            <template v-else>
              <Transition name="full-icon">
                <Heart
                  v-if="!liked[key]"
                  key="outline"
                  :size="20"
                  fill="none"
                  :stroke-width="2"
                />
                <Heart
                  v-else
                  key="filled"
                  :size="20"
                  fill="currentColor"
                  :stroke-width="0"
                />
              </Transition>
            </template>
          </span>

          <span class="like-btn-count-wrapper">
            <!-- No animation: instant swap -->
            <template v-if="key === 'none'">
              <span class="like-btn-count">{{ counts[key] }}</span>
            </template>

            <!-- Opacity: fade -->
            <template v-else-if="key === 'opacity'">
              <Transition name="fade-count">
                <span :key="counts[key]" class="like-btn-count">{{ counts[key] }}</span>
              </Transition>
            </template>

            <!-- Full: slide vertical -->
            <template v-else>
              <Transition :name="liked[key] ? 'slide-count-down' : 'slide-count-up'">
                <span :key="counts[key]" class="like-btn-count">{{ counts[key] }}</span>
              </Transition>
            </template>
          </span>
        </button>
        <span v-if="!variant" class="icon-label">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout */

.animating-icons {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icons-row {
  display: flex;
  align-items: flex-start;
  gap: 2.5rem;
}

.icon-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.icon-label {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

/* Like button */

.like-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease, transform 0.15s ease;
  user-select: none;
}

.like-btn:hover {
  border-color: var(--color-text-muted);
  background-color: var(--color-bg-subtle);
}

.like-btn:active {
  transform: scale(0.96);
}

.like-btn--liked {
  color: #ef4444;
  border-color: color-mix(in srgb, #ef4444 30%, transparent);
}

.like-btn--liked:hover {
  border-color: color-mix(in srgb, #ef4444 50%, transparent);
  background-color: color-mix(in srgb, #ef4444 5%, var(--color-bg));
}

/* Icon wrapper */

.like-btn-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* Count wrapper */

.like-btn-count-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 1.2em;
}

.like-btn-count {
  display: block;
  line-height: 1.2em;
}

/* Fade icon transition (opacity level) */

.fade-icon-enter-active,
.fade-icon-leave-active {
  transition: opacity 0.3s ease;
}

.fade-icon-leave-active {
  position: absolute;
}

.fade-icon-enter-from,
.fade-icon-leave-to {
  opacity: 0;
}

/* Full icon transition (opacity + scale + blur) */

.full-icon-enter-active,
.full-icon-leave-active {
  transition: opacity 0.3s ease,
              scale 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.3s ease;
}

.full-icon-leave-active {
  position: absolute;
}

.full-icon-enter-from,
.full-icon-leave-to {
  opacity: 0;
  scale: 0.25;
  filter: blur(4px);
}

/* Fade count transition (opacity level) */

.fade-count-enter-active,
.fade-count-leave-active {
  transition: opacity 0.2s ease;
}

.fade-count-leave-active {
  position: absolute;
}

.fade-count-enter-from,
.fade-count-leave-to {
  opacity: 0;
}

/* Slide count up (full level, like) */

.slide-count-up-enter-active,
.slide-count-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-count-up-leave-active {
  position: absolute;
}

.slide-count-up-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-count-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

/* Slide count down (full level, unlike) */

.slide-count-down-enter-active,
.slide-count-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-count-down-leave-active {
  position: absolute;
}

.slide-count-down-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.slide-count-down-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

/* Reduced motion */

@media (prefers-reduced-motion: reduce) {
  .like-btn,
  .fade-icon-enter-active,
  .fade-icon-leave-active,
  .full-icon-enter-active,
  .full-icon-leave-active,
  .fade-count-enter-active,
  .fade-count-leave-active,
  .slide-count-up-enter-active,
  .slide-count-up-leave-active,
  .slide-count-down-enter-active,
  .slide-count-down-leave-active {
    transition: none !important;
  }
}
</style>
