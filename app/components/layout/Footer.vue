<script setup lang="ts">
import { BadgeCheck, Copy } from 'lucide-vue-next'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-info">
      <p class="footer-location">{{ t('footer.location') }}</p>
      <p class="footer-status">
        {{ t('footer.status') }}
        <BadgeCheck class="footer-icon" />
      </p>
      <p class="footer-copyright">
        {{ t('footer.copyright', { year }) }}
      </p>
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
    </nav>
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
}

.footer-location {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-accent-muted);
}

.footer-copyright {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.footer-icon {
  width: 1rem;
  height: 1rem;
}

.footer-nav {
  display: none;
  align-items: center;
  gap: 0.25rem;
}

@media (min-width: 640px) {
  .footer-nav {
    display: flex;
  }
}

.footer-email {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--color-bg-accent);
  padding: 0.125rem 0.25rem;
  color: var(--color-accent);
}

.footer-link {
  padding: 0.125rem 0.25rem;
  transition: color 0.15s;
}

.footer-link:hover {
  color: var(--color-text-hover);
}
</style>
