<script setup lang="ts">
import { BadgeCheck, Copy } from 'lucide-vue-next'

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
      <div class="footer-status">
        <span>{{ t('footer.status') }}</span>
        <BadgeCheck class="footer-icon" />
      </div>

      <nav aria-label="Liens sociaux" class="footer-nav">
        <a
          href="mailto:alexandre@revemieux.fr"
          aria-label="Envoyer un email à alexandre@revemieux.fr"
          class="footer-email"
        >
          <Copy class="footer-icon" aria-hidden="true" />
          alexandre@revemieux.fr
        </a>
        <a
          href="https://linkedin.com/in/alexbrndl"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/alexbrndl"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          Github
        </a>
        <a
          href="https://figma.com/@alexbrndl"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
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
  align-items: flex-end;
  justify-content: space-between;
  border-top: 1px solid var(--color-border);
  padding-top: 3rem;
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
  display: none;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .footer-right {
    display: flex;
  }
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1rem;
  letter-spacing: -0.04em;
  color: var(--color-accent);
}

.footer-icon {
  width: 1rem;
  height: 1rem;
}

.footer-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 0.25rem;
}

.footer-email {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--color-bg-accent);
  padding: 0.125rem 0.25rem;
  font-size: 1rem;
  letter-spacing: -0.04em;
  color: var(--color-accent);
}

.footer-link {
  padding: 0.125rem 0.25rem;
  font-size: 1rem;
  letter-spacing: -0.04em;
  color: var(--color-text-muted);
  transition: all 0.15s;
}

.footer-link:hover {
  color: var(--color-text-hover);
  background-color: var(--color-bg-hover);
}
</style>
