<script setup lang="ts">
import { Copy } from 'lucide-vue-next'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-info">
      <p class="footer-location">{{ t('footer.location') }}</p>
      <p class="footer-copyright">
        {{ t('footer.copyright', { year }) }}
      </p>
    </div>

    <div class="footer-right">
      <nav :aria-label="t('footer.socialNav')" class="footer-nav">
        <a
          href="mailto:alexandre@revemieux.fr"
          :aria-label="t('footer.emailAriaLabel')"
          class="footer-email link"
        >
          <Copy class="footer-icon" aria-hidden="true" />
          alexandre@revemieux.fr
        </a>
        <a
          href="https://www.linkedin.com/in/alexandre-brondel/"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link link"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/alexbrndl"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link link"
        >
          Github
        </a>
        <a
          href="https://figma.com/@alexbrndl"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link link"
        >
          Figma
        </a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  flex-direction: column-reverse;
  gap: 1.5rem;
  border-top: 1px solid var(--color-border);
  padding-top: 3rem;
}

@media (min-width: 640px) {
  .footer {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: var(--color-text-muted);
}

.footer-location {
  font-size: 0.875rem;
  letter-spacing: -0.04em;
}

.footer-copyright {
  font-size: 0.75rem;
  letter-spacing: -0.04em;
}

.footer-right {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .footer-right {
    align-items: flex-end;
  }
}

.footer-icon {
  width: 1rem;
  height: 1rem;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.25rem;
}

.footer-email {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.25rem;
  font-size: 1rem;
  letter-spacing: -0.04em;
  color: var(--color-accent);
  background-color: var(--color-bg-accent);
  background-size: 100% 0px;
}

.footer-link {
  padding: 0.125rem 0.25rem;
  font-size: 1rem;
  letter-spacing: -0.04em;
  color: var(--color-text-muted);
  background-size: 100% 0px;
}

.footer-email:hover,
.footer-link:hover {
  background-size: 100% 100%;
}

.footer-email:focus-visible,
.footer-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 0.25rem;
}
</style>
