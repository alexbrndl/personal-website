<script setup lang="ts">
import {
  ToolbarRoot,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from 'reka-ui'
import { ArrowUp, Loader2, Check, Link, ChevronDown } from 'lucide-vue-next'

// Props

interface Props {
  variant?: 'text' | 'toolbar'
}

const { variant } = defineProps<Props>()

// State

const aiMode = ref(false)
const toolbarVisible = ref(false)
const formats = ref<string[]>([])
const sendState = ref<'idle' | 'loading' | 'success'>('idle')
const prompt = ref('')
const toolbarEl = ref<HTMLElement>()
const contentEl = ref<HTMLElement>()
const markEl = ref<HTMLElement>()
const toolbarWidth = ref<number | null>(null)
const formatWidth = ref<number | null>(null)
const toolbarLeft = ref<number | null>(null)
const toolbarBottom = ref<number | null>(null)
const slow = variant ? useState('craft-demo-slow', () => false) : ref(false)

// Computed

const highlightStyle = computed(() => {
  const s: Record<string, string> = {}
  if (formats.value.includes('bold')) s.fontWeight = '700'
  if (formats.value.includes('italic')) s.fontStyle = 'italic'
  const decorations: string[] = []
  if (formats.value.includes('underline')) decorations.push('underline')
  if (formats.value.includes('strikethrough')) decorations.push('line-through')
  if (decorations.length) s.textDecoration = decorations.join(' ')
  return s
})

// Lock toolbar width on mount

onMounted(() => {
  if (variant === 'toolbar') {
    toolbarVisible.value = true
  }
  if (toolbarEl.value) {
    toolbarWidth.value = toolbarEl.value.offsetWidth
    const formatEl = toolbarEl.value.querySelector('.toolbar-format-inner') as HTMLElement | null
    const sepEl = toolbarEl.value.querySelector('.toolbar-ai > .toolbar-separator') as HTMLElement | null
    const aiBtnEl = toolbarEl.value.querySelector('.toolbar-btn--ai') as HTMLElement | null
    if (formatEl) {
      const sepWidth = sepEl ? sepEl.offsetWidth + parseFloat(getComputedStyle(sepEl).marginLeft) + parseFloat(getComputedStyle(sepEl).marginRight) : 0
      const currentGap = aiBtnEl ? parseFloat(getComputedStyle(aiBtnEl).gap) : 0
      const targetGap = 6
      const gapDiff = targetGap - currentGap
      formatWidth.value = formatEl.offsetWidth - sepWidth - gapDiff
    }
  }
  if (markEl.value && contentEl.value) {
    const markRect = markEl.value.getBoundingClientRect()
    const contentRect = contentEl.value.getBoundingClientRect()
    toolbarLeft.value = markRect.left + markRect.width / 2 - contentRect.left
    toolbarBottom.value = contentRect.height - (markRect.top - contentRect.top) + 16
  }
})

// AI mode

function toggleAiMode() {
  aiMode.value = !aiMode.value
  if (!aiMode.value) {
    prompt.value = ''
    sendState.value = 'idle'
  }
}

// Send feedback

function handleSend() {
  if (sendState.value !== 'idle') return
  sendState.value = 'loading'

  setTimeout(() => {
    sendState.value = 'success'
    setTimeout(() => {
      toolbarVisible.value = false
      setTimeout(() => {
        sendState.value = 'idle'
        aiMode.value = false
        prompt.value = ''
        if (variant === 'toolbar') {
          setTimeout(() => {
            toolbarVisible.value = true
          }, 1000)
        }
      }, 300)
    }, 800)
  }, 1500)
}

// Toggle toolbar

function handleTextClick() {
  toolbarVisible.value = !toolbarVisible.value
  if (toolbarVisible.value) {
    aiMode.value = false
    sendState.value = 'idle'
    prompt.value = ''
  }
}
</script>

<template>
  <div class="floating-toolbar-demo" :class="{ 'floating-toolbar-demo--variant': variant }" :style="{ '--toolbar-duration': slow ? '4s' : '0.8s' }">
    <div ref="contentEl" :class="variant === 'toolbar' ? 'demo-toolbar-standalone' : 'demo-content'">
      <div
        class="toolbar-wrapper"
        :class="{
          'toolbar-wrapper--hidden': !toolbarVisible,
          'toolbar-wrapper--static': variant === 'toolbar',
        }"
        :style="variant !== 'toolbar' && toolbarLeft != null && toolbarBottom != null
          ? { left: `${toolbarLeft}px`, bottom: `${toolbarBottom}px` }
          : {}"
        @click.stop
      >
        <div
          ref="toolbarEl"
          class="toolbar-sizer"
          :style="toolbarWidth ? { width: `${toolbarWidth}px` } : {}"
        >
          <ToolbarRoot
            class="toolbar"
            :class="{ 'toolbar--ai': aiMode }"
            aria-label="Text formatting"
          >
            <div class="toolbar-format">
              <div class="toolbar-format-inner">
                <ToolbarButton class="toolbar-btn toolbar-btn--select" disabled>
                  <span>Paragraph</span>
                  <ChevronDown :size="14" />
                </ToolbarButton>
                <ToolbarSeparator class="toolbar-separator" />
                <ToolbarButton class="toolbar-btn" disabled>
                  <Link :size="14" />
                  <span>Link</span>
                </ToolbarButton>
                <ToolbarSeparator class="toolbar-separator" />
                <ToolbarToggleGroup v-model="formats" type="multiple" class="toolbar-toggle-group">
                  <ToolbarToggleItem value="bold" class="toolbar-toggle toolbar-toggle--bold">B</ToolbarToggleItem>
                  <ToolbarToggleItem value="italic" class="toolbar-toggle toolbar-toggle--italic">I</ToolbarToggleItem>
                  <ToolbarToggleItem value="underline" class="toolbar-toggle toolbar-toggle--underline">U</ToolbarToggleItem>
                  <ToolbarToggleItem value="strikethrough" class="toolbar-toggle toolbar-toggle--strike">S</ToolbarToggleItem>
                </ToolbarToggleGroup>
                <ToolbarSeparator class="toolbar-separator" />
              </div>
            </div>
            <ToolbarButton class="toolbar-btn toolbar-btn--ai" :class="{ 'toolbar-btn--ai-active': aiMode }" @click="toggleAiMode">
              <span class="toolbar-btn-ai-dot" />
              <span class="toolbar-btn-ai-label">
                <span class="toolbar-btn-ai-text" :class="{ 'toolbar-btn-ai-text--flipped': aiMode }">
                  <span class="toolbar-btn-ai-text-inner">Ask AI</span>
                  <span class="toolbar-btn-ai-text-inner">Close AI</span>
                </span>
              </span>
            </ToolbarButton>
            <div class="toolbar-ai">
              <ToolbarSeparator class="toolbar-separator" />
              <div class="toolbar-ai-inner" :style="formatWidth ? { width: `${formatWidth}px` } : {}">
                <input
                  v-model="prompt"
                  class="toolbar-input"
                  type="text"
                  placeholder="Ask AI..."
                  @keydown.enter="handleSend"
                >
                <button
                  class="toolbar-send"
                  :aria-label="sendState === 'idle' ? 'Send' : sendState === 'loading' ? 'Sending' : 'Sent'"
                  :disabled="sendState !== 'idle'"
                  @click="handleSend"
                >
                  <Transition name="send-icon" type="transition">
                    <ArrowUp v-if="sendState === 'idle'" key="idle" :size="14" />
                    <Loader2 v-else-if="sendState === 'loading'" key="loading" :size="14" class="spinner" />
                    <Check v-else-if="sendState === 'success'" key="success" :size="14" />
                  </Transition>
                </button>
              </div>
            </div>
          </ToolbarRoot>
        </div>
      </div>

      <div v-if="variant !== 'toolbar'" class="demo-text" :class="{ 'demo-text--centered': variant === 'text' }">
        <template v-if="!variant">
          Highlight text in a modern text editor and a contextual
          toolbar appears just above it. Toggle bold, italic,
          or strikethrough on
        </template>
        <mark
          ref="markEl"
          class="demo-highlight"
          :class="{
            'demo-highlight--ai': aiMode && toolbarVisible,
            'demo-highlight--closed': !toolbarVisible,
          }"
          :style="highlightStyle"
          @click="handleTextClick"
        >selected text</mark>
        <template v-if="!variant">
          with one click, or ask the AI assistant to rewrite
          and refine your highlighted passage from the toolbar.
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Demo layout */

.floating-toolbar-demo {
  padding: 2rem 1.5rem;
  width: 100%;
  max-width: 540px;
}

.floating-toolbar-demo--variant {
  max-width: none;
}

.demo-content {
  position: relative;
}

/* Toolbar wrapper (show/hide, absolute above text) */

.toolbar-wrapper {
  position: absolute;
  transform: translateX(-50%);
  opacity: 1;
  transition: opacity 0.25s ease, transform 0.25s ease;
  z-index: 10;
}

.toolbar-wrapper--hidden {
  opacity: 0;
  transform: translateX(-50%) translateY(16px) scale(80%);
  pointer-events: none;
}

/* Toolbar sizer (locks width) */

.toolbar-sizer {
  width: max-content;
}

/* Toolbar root (CSS Grid) */

.toolbar {
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 0fr;
  align-items: center;
  border: var(--color-border) 1px solid;
  border-radius: 99px;
  overflow: hidden;
  padding: 4px;
  background-color: var(--color-bg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: grid-template-columns var(--toolbar-duration, 0.8s) cubic-bezier(0.4, 0, 0.2, 1);
}

.toolbar::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 4px var(--color-bg);
  pointer-events: none;
  z-index: 1;
}

.toolbar--ai {
  grid-template-columns: 0fr auto 1fr;
}

/* Format panel (grid column 1) */

.toolbar-format {
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
  min-width: 0;
}

.toolbar-format-inner {
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
}

/* AI panel (grid column 3) */

.toolbar-ai {
  display: flex;
  align-items: center;
  overflow: hidden;
  min-width: 0;
}

.toolbar-ai-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Shared button base */

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease, border-radius var(--toolbar-duration, 0.4s) ease, gap var(--toolbar-duration, 0.4s) ease, scale 0.2s ease;
}

.toolbar-btn:hover {
  background-color: var(--color-bg-subtle);
}

.toolbar-btn:disabled {
  cursor: default;
  opacity: 0.5;
}

.toolbar-btn:disabled:hover {
  background-color: transparent;
}

.toolbar-btn--select {
  gap: 2px;
}

/* Separator */

.toolbar-separator {
  width: 1px;
  height: 16px;
  margin: 0 6px;
  background-color: var(--color-border);
  flex-shrink: 0;
}

/* Toggle group */

.toolbar-toggle-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, scale 0.2s ease;
}

.toolbar-toggle:hover {
  background-color: var(--color-bg-subtle);
}

.toolbar-toggle:active {
  scale: 0.95;
}

.toolbar-toggle[data-state="on"] {
  background-color: var(--color-bg-subtle-hover);
  color: var(--color-text-hover);
}

.toolbar-toggle--bold {
  font-weight: 700;
}

.toolbar-toggle--italic {
  font-style: italic;
}

.toolbar-toggle--underline {
  text-decoration: underline;
}

.toolbar-toggle--strike {
  text-decoration: line-through;
}

/* AI button (pivot, grid column 2) */

.toolbar-btn--ai {
  flex-shrink: 0;
  gap: 2px;
  color: var(--color-text);
  background-color: var(--color-bg-subtle);
  border: var(--color-border) 1px solid;
  border-radius: 6px 16px 16px 6px;
}

.toolbar-btn--ai:active {
  scale: 0.95;
}

.toolbar-btn--ai:hover {
  background-color: var(--color-bg-subtle-hover);
}

.toolbar-btn--ai-active {
  border-radius: 16px 6px 6px 16px;
  gap: 6px;
}

.toolbar-btn-ai-dot {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-malachite-800), var(--color-malachite-200));
  flex-shrink: 0;
  scale: 1;
  transition: scale 0.3s ease;
}

.toolbar-btn-ai-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: inherit;
  filter: blur(4px);
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: -1;
}

.toolbar-btn--ai:hover .toolbar-btn-ai-dot {
  scale: 1.2;
  animation: spin 1s linear infinite;
}

.toolbar-btn--ai:hover .toolbar-btn-ai-dot::after {
  opacity: 1;
}

.toolbar-btn-ai-label {
  display: block;
  height: 1.2em;
  overflow: hidden;
}

.toolbar-btn-ai-text {
  display: flex;
  flex-direction: column;
  transition: transform var(--toolbar-duration, 0.4s) cubic-bezier(0.4, 0, 0.2, 1);
}

.toolbar-btn-ai-text--flipped {
  transform: translateY(-50%);
}

.toolbar-btn-ai-text-inner {
  display: block;
  height: 1.2em;
  line-height: 1.2em;
  white-space: nowrap;
}

/* AI input */

.toolbar-input {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-subtle);
  color: var(--color-text);
  font-size: 0.8125rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
}

.toolbar-input::placeholder {
  color: var(--color-text-muted);
}

.toolbar-input:focus {
  border-color: var(--color-text-muted);
}

/* Send button */

.toolbar-send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 28px;
  border: none;
  border-radius: 6px 16px 16px 6px;
  background-color: var(--color-malachite-600);
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s ease, scale 0.2s ease;
}

.toolbar-send:hover {
  background-color: var(--color-malachite-700);
}

.toolbar-send:disabled {
  cursor: default;
  pointer-events: none;
}

.toolbar-send:active {
  scale: 0.95;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Send icon transition */

.send-icon-enter-active,
.send-icon-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              scale 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.send-icon-leave-active {
  position: absolute;
}

.send-icon-enter-from,
.send-icon-leave-to {
  opacity: 0;
  scale: 0.25;
  filter: blur(4px);
}

/* Toolbar standalone (variant=toolbar) */

.demo-toolbar-standalone {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  min-height: 120px;
}

.toolbar-wrapper--static {
  position: relative;
  transform: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toolbar-wrapper--static.toolbar-wrapper--hidden {
  opacity: 0;
  transform: translateY(16px) scale(80%);
  pointer-events: none;
}

/* Demo text */

.demo-text {
  font-size: 1.5rem;
  line-height: 1.7;
  color: var(--color-text-muted);
  max-width: 440px;
  text-align: center;
  mask-image: radial-gradient(ellipse 55% 50% at 60% 50%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 55% 50% at 60% 50%, black 20%, transparent 80%);
}

.demo-text--centered {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  min-height: 100px;
  max-width: none;
  mask-image: none;
  -webkit-mask-image: none;
  isolation: isolate;
}

/* Text highlight */

.demo-highlight {
  position: relative;
  background: none;
  color: var(--color-text);
  padding: 1px 2px;
  cursor: pointer;
  white-space: nowrap;
}

.demo-highlight::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: color-mix(in srgb, var(--color-accent-underline) 75%, transparent);
  transition: background-color var(--toolbar-duration, 0.4s) ease;
  z-index: -1;
}

.demo-highlight--closed::before {
  background-color: color-mix(in srgb, var(--color-accent-underline) 25%, transparent);
}

.demo-highlight--closed:hover::before {
  background-color: color-mix(in srgb, var(--color-accent-underline) 50%, transparent);
}

.demo-highlight--ai {
  background: linear-gradient(90deg, var(--color-malachite-300), var(--color-malachite-500), var(--color-malachite-300), var(--color-malachite-500), var(--color-malachite-300));
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 0.5s linear infinite;
}

.demo-highlight--ai::before {
  background-color: color-mix(in srgb, var(--color-accent-underline) 25%, transparent);
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: -100% 50%; }
}

/* Reduced motion */

@media (prefers-reduced-motion: reduce) {
  .toolbar,
  .toolbar-wrapper,
  .toolbar-btn-ai-text,
  .demo-highlight,
  .send-icon-enter-active,
  .send-icon-leave-active {
    transition: none !important;
  }

  .spinner {
    animation: none;
  }
}
</style>

<style>
html.dark .floating-toolbar-demo .toolbar {
  background-color: var(--color-bg);
}

html.dark .floating-toolbar-demo .demo-highlight--ai {
  background: linear-gradient(90deg, var(--color-malachite-200), var(--color-malachite-600), var(--color-malachite-200), var(--color-malachite-600), var(--color-malachite-200));
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
