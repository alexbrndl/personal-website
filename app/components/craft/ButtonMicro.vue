<script setup lang="ts">
import gsap from 'gsap'
import { Loader2, Check, X } from 'lucide-vue-next'

interface Props {
  variant: 'hover' | 'ripple' | 'states' | 'loading-success' | 'error' | 'hover-effects'
}

const { variant } = defineProps<Props>()

function cssVar(el: Element, name: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim()
}

// ── Ripple ──

interface Ripple { id: number, x: number, y: number }

let rippleId = 0
const ripples = ref<Ripple[]>([])

function handleRipple(event: MouseEvent) {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const id = rippleId++

  ripples.value.push({ id, x, y })

  nextTick(() => {
    const el = button.querySelector(`[data-ripple-id="${id}"]`)
    if (!el) return

    gsap.fromTo(el,
      { scale: 0, opacity: 0.6 },
      {
        scale: 4, opacity: 0, duration: 0.6, ease: 'power2.out',
        onComplete: () => { ripples.value = ripples.value.filter(r => r.id !== id) },
      },
    )
  })
}

// ── Machine d'états (CSS transitions) ──

type ButtonState = 'idle' | 'loading' | 'success'
const buttonState = ref<ButtonState>('idle')

function simulateStates() {
  if (buttonState.value !== 'idle') return
  buttonState.value = 'loading'

  gsap.delayedCall(1.5, () => {
    buttonState.value = 'success'
    gsap.delayedCall(2, () => { buttonState.value = 'idle' })
  })
}

// ── Machine d'états (GSAP transitions) ──

const lsState = ref<'idle' | 'loading' | 'success'>('idle')
const lsButtonRef = ref<HTMLElement>()

function simulateLoadingSuccess() {
  if (lsState.value !== 'idle') return
  lsState.value = 'loading'

  gsap.delayedCall(1.5, () => {
    lsState.value = 'success'
    gsap.delayedCall(2, () => { lsState.value = 'idle' })
  })
}

function lsLeave(el: Element, done: () => void) {
  const btn = lsButtonRef.value
  if (!btn) return done()

  if (lsState.value === 'loading') {
    gsap.to(el, { opacity: 0, duration: 0.15, ease: 'power2.in', onComplete: done })
  } else if (lsState.value === 'success') {
    gsap.to(el, { opacity: 0, scale: 0.5, duration: 0.2, ease: 'power2.in', onComplete: done })
  } else {
    gsap.to(btn, {
      backgroundColor: cssVar(btn, '--color-bg'),
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => { gsap.set(btn, { clearProps: 'backgroundColor' }) },
    })
    gsap.to(el, { opacity: 0, duration: 0.15, ease: 'power2.in', onComplete: done })
  }
}

function lsEnter(el: Element, done: () => void) {
  const btn = lsButtonRef.value
  if (!btn) return done()

  if (lsState.value === 'loading') {
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'power2.out', onComplete: done })
  } else if (lsState.value === 'success') {
    gsap.to(btn, { backgroundColor: cssVar(btn, '--color-bg-accent'), duration: 0.3, ease: 'power2.out' })
    gsap.fromTo(el, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)', onComplete: done })
  } else {
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'power2.out', onComplete: done })
  }
}

// ── Error shake ──

const errorState = ref<'idle' | 'error'>('idle')
const errorButtonRef = ref<HTMLElement>()

function simulateError() {
  if (errorState.value !== 'idle') return

  const btn = errorButtonRef.value
  if (!btn) return

  errorState.value = 'error'
  gsap.set(btn, { transition: 'none' })

  const tl = gsap.timeline()
  tl.to(btn, { x: -8, duration: 0.05 })
    .to(btn, { x: 8, duration: 0.05 })
    .to(btn, { x: -6, duration: 0.05 })
    .to(btn, { x: 6, duration: 0.05 })
    .to(btn, { x: -3, duration: 0.05 })
    .to(btn, { x: 3, duration: 0.05 })
    .to(btn, { x: 0, duration: 0.05 })
  tl.to(btn, { backgroundColor: cssVar(btn, '--color-error'), duration: 0.2, ease: 'power2.out' }, 0)

  gsap.delayedCall(2, () => {
    gsap.to(btn, {
      backgroundColor: cssVar(btn, '--color-bg'),
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => { gsap.set(btn, { clearProps: 'backgroundColor,transition' }) },
    })
    errorState.value = 'idle'
  })
}

// ── Hover effects ──

function handleMagneticDown() {
  const btn = magneticRef.value
  if (!btn) return
  gsap.to(btn, { scale: 0.98, duration: 0.15, ease: 'power2.out' })
}

function handleMagneticUp() {
  const btn = magneticRef.value
  if (!btn) return
  gsap.to(btn, { scale: 1, duration: 0.15, ease: 'power2.out' })
}

function handleGlowMove(event: MouseEvent) {
  const btn = event.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()
  btn.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
  btn.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
}

const magneticRef = ref<HTMLElement>()
let xTo: ReturnType<typeof gsap.quickTo> | null = null
let yTo: ReturnType<typeof gsap.quickTo> | null = null

function handleMagneticEnter() {
  const btn = magneticRef.value
  if (!btn) return
  xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power2.out' })
  yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power2.out' })
}

function handleMagneticMove(event: MouseEvent) {
  const btn = magneticRef.value
  if (!btn || !xTo || !yTo) return
  const rect = btn.getBoundingClientRect()
  xTo((event.clientX - (rect.left + rect.width / 2)) / 3)
  yTo((event.clientY - (rect.top + rect.height / 2)) / 3)
}

function handleMagneticLeave() {
  xTo = null
  yTo = null
  const btn = magneticRef.value
  if (!btn) return
  gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
}

const borderAngle = ref(0)
let borderTween: gsap.core.Tween | null = null
const borderHovered = ref(false)

function initBorderAnimation() {
  if (borderTween) return
  borderTween = gsap.to(borderAngle, {
    value: 360,
    duration: 4,
    repeat: -1,
    ease: 'none',
    modifiers: {
      value: (v: string) => `${parseFloat(v) % 360}`,
    },
  })
}

function accelerateBorder() {
  borderHovered.value = true
  if (borderTween) gsap.to(borderTween, { timeScale: 3, duration: 0.4, ease: 'power2.out' })
}

function decelerateBorder() {
  borderHovered.value = false
  if (borderTween) gsap.to(borderTween, { timeScale: 1, duration: 0.6, ease: 'power2.out' })
}

// ── Accessibilité & cleanup ──

if (import.meta.client) {
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.globalTimeline.timeScale(100)
    return () => { gsap.globalTimeline.timeScale(1) }
  })

  onMounted(() => {
    if (variant === 'hover-effects') initBorderAnimation()
  })

  onUnmounted(() => {
    mm.revert()
    gsap.globalTimeline.timeScale(1)
    if (borderTween) borderTween.kill()
  })
}
</script>

<template>
  <div class="btn-demo">
    <div v-if="variant === 'hover'" class="btn-demo-area">
      <button class="btn">Envoyer</button>
    </div>

    <div v-if="variant === 'ripple'" class="btn-demo-area">
      <button class="btn btn--ripple" @click="handleRipple">
        Ripple
        <span
          v-for="ripple in ripples"
          :key="ripple.id"
          :data-ripple-id="ripple.id"
          class="ripple"
          :style="{ left: ripple.x + 'px', top: ripple.y + 'px' }"
        />
      </button>
    </div>

    <div v-if="variant === 'states'" class="btn-demo-area">
      <button
        class="btn btn--states"
        :class="{
          'btn--loading': buttonState === 'loading',
          'btn--success': buttonState === 'success',
        }"
        :aria-disabled="buttonState !== 'idle'"
        aria-live="polite"
        @click="simulateStates"
      >
        <Transition name="fade" mode="out-in">
          <span v-if="buttonState === 'idle'" key="idle" class="btn-content">
            Envoyer
          </span>
          <span v-else-if="buttonState === 'loading'" key="loading" class="btn-content">
            <Loader2 :size="16" class="spinner" />
            Envoi…
          </span>
          <span v-else-if="buttonState === 'success'" key="success" class="btn-content">
            <Check :size="16" />
            Envoyé
          </span>
        </Transition>
      </button>
    </div>

    <div v-if="variant === 'loading-success'" class="btn-demo-area">
      <button
        ref="lsButtonRef"
        class="btn btn--states"
        :class="{ 'btn--loading': lsState === 'loading' }"
        :aria-disabled="lsState !== 'idle'"
        aria-live="polite"
        @click="simulateLoadingSuccess"
      >
        <Transition :css="false" mode="out-in" @leave="lsLeave" @enter="lsEnter">
          <span v-if="lsState === 'idle'" key="idle" class="btn-content">
            Envoyer
          </span>
          <span v-else-if="lsState === 'loading'" key="loading" class="btn-content">
            <Loader2 :size="16" class="spinner" />
            Envoi…
          </span>
          <span v-else-if="lsState === 'success'" key="success" class="btn-content">
            <Check :size="16" />
            Envoyé
          </span>
        </Transition>
      </button>
    </div>

    <div v-if="variant === 'error'" class="btn-demo-area">
      <button
        ref="errorButtonRef"
        class="btn btn--states"
        :class="{ 'btn--error': errorState === 'error' }"
        :aria-disabled="errorState !== 'idle'"
        aria-live="assertive"
        @click="simulateError"
      >
        <Transition name="fade" mode="out-in">
          <span v-if="errorState === 'idle'" key="idle" class="btn-content">
            Envoyer
          </span>
          <span v-else key="error" class="btn-content">
            <X :size="16" />
            Erreur
          </span>
        </Transition>
      </button>
    </div>

    <div v-if="variant === 'hover-effects'" class="btn-demo-area btn-demo-area--row">
      <button class="btn btn--glow" @mousemove="handleGlowMove">
        Glow
      </button>

      <button
        ref="magneticRef"
        class="btn btn--magnetic"
        @mousedown="handleMagneticDown"
        @mouseup="handleMagneticUp"
        @mouseenter="handleMagneticEnter"
        @mousemove="handleMagneticMove"
        @mouseleave="handleMagneticLeave"
      >
        Magnetic
      </button>

      <div
        class="btn-border-wrapper"
        :class="{ 'btn-border-wrapper--hovered': borderHovered }"
        :style="{ '--border-angle': `${borderAngle}deg` }"
        @mouseenter="accelerateBorder"
        @mouseleave="decelerateBorder"
      >
        <div class="btn-border-halo" aria-hidden="true" />
        <button class="btn btn--animated-border">
          Border
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-demo {
  padding: 1.5rem;
}

.btn-demo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.btn-demo-area--row {
  gap: 1rem;
}

/* ── Base ── */

.btn {
  --color-error: #ef4444;
  padding: 0.875rem 2.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  cursor: pointer;
  background-color: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.btn:hover {
  transform: scale(1.02);
  background-color: var(--color-bg-hover);
}

.btn:active {
  transform: scale(0.98);
}

.btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.btn[aria-disabled="true"] {
  pointer-events: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

/* ── Ripple ── */

.btn--ripple {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-bg-accent);
  transform: translate(-50%, -50%) scale(0);
  pointer-events: none;
}

/* ── States ── */

.btn--states {
  min-width: 160px;
  transition: transform 0.15s ease, background-color 0.3s ease, color 0.3s ease, min-width 0.3s ease;
}

.btn--loading {
  cursor: wait;
}

.btn--success {
  background-color: var(--color-bg-accent);
}

.btn--error {
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Hover effects ── */

.btn--glow {
  position: relative;
  background:
    radial-gradient(
      circle 80px at var(--glow-x, 50%) var(--glow-y, 50%),
      color-mix(in srgb, var(--color-accent-link) 0%, transparent),
      transparent
    ),
    var(--color-bg);
}

.btn--glow:hover {
  background:
    radial-gradient(
      circle 80px at var(--glow-x, 50%) var(--glow-y, 50%),
      color-mix(in srgb, var(--color-accent-link) 50%, transparent),
      transparent
    ),
    var(--color-bg-hover);
  transform: none;
}

.btn--glow:active {
  transform: scale(0.98);
}

.btn--magnetic {
  transition: none;
}

.btn--magnetic:hover {
  transform: none;
  background-color: var(--color-bg-hover);
}

.btn-border-wrapper {
  position: relative;
  border-radius: 14px;
  padding: 2px;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    var(--color-malachite-500),
    transparent 40%,
    transparent 60%,
    var(--color-malachite-500)
  );
}

.btn-border-halo {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    var(--color-malachite-500),
    transparent 40%,
    transparent 60%,
    var(--color-malachite-500)
  );
  filter: blur(0px);
  opacity: 0;
  transition: filter 0.4s ease, opacity 0.4s ease;
  pointer-events: none;
}

.btn-border-wrapper--hovered .btn-border-halo {
  filter: blur(12px);
  opacity: 0.6;
}

.btn--animated-border {
  position: relative;
  border-radius: 12px;
  width: 100%;
  background-color: var(--color-bg);
  color: var(--color-text);
  border-color: transparent;
}

.btn--animated-border:hover {
  transform: none;
}

.btn--animated-border:active {
  transform: scale(0.98);
}


/* ── Reduced motion ── */

@media (prefers-reduced-motion: reduce) {
  .btn,
  .btn--states,
  .fade-enter-active,
  .fade-leave-active {
    transition: none !important;
  }

  .spinner {
    animation: none;
  }
}
</style>
