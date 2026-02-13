<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const isHome = computed(() => route.path === '/')
</script>

<template>
  <header>
    <div class="header-content">
      <!-- Index: avatar + full name -->
      <NuxtLink v-if="isHome" to="/" class="identity">
        <div class="avatar">
          <NuxtImg
            src="/images/avatar.png"
            alt="Alexandre Brondel"
            class="avatar-img"
          />
        </div>
        <div>
          <p class="identity-name">{{ t('home.name') }}</p>
          <p>{{ t('home.title') }}</p>
        </div>
      </NuxtLink>

      <!-- Other pages: compact text -->
      <NuxtLink v-else to="/" class="identity-alt">
        <span class="identity-alt-name">alexbrndl</span>
        <span>{{ t('home.title') }}</span>
      </NuxtLink>

      <LayoutNavigation />
    </div>
  </header>
</template>

<style scoped>
.header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .header-content {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

/* Index variant */
.identity {
  display: flex;
  align-items: flex-end;
  gap: 0.375rem;
}

.avatar {
  width: 3rem;
  height: 3rem;
  overflow: hidden;
  border-radius: 0.125rem;
  background-color: var(--color-bg-foreground);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.identity-name {
  font-weight: 600;
}

/* Compact variant (non-index pages) */
.identity-alt {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.identity-alt-name {
  font-weight: 600;
}
</style>
