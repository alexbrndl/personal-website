import { MousePointerClick, Image } from 'lucide-vue-next'
import type { Ref } from 'vue'

export function useCraftFilter<C, G>(
  craftItems: Ref<C[] | null | undefined>,
  galleryImages: Ref<G[] | null | undefined>,
  i18nPrefix: string,
) {
  const { t } = useI18n()

  const activeFilter = ref('all')

  const filterTabs = computed(() => [
    { value: 'all', label: t(`${i18nPrefix}.filterAll`) },
    { value: 'interactive', label: t(`${i18nPrefix}.filterInteractive`), icon: MousePointerClick },
    { value: 'visual', label: t(`${i18nPrefix}.filterVisual`), icon: Image },
  ])

  const displayedCraftItems = computed(() =>
    activeFilter.value === 'visual' ? [] : (craftItems.value ?? [])
  )

  const displayedGalleryItems = computed(() =>
    activeFilter.value === 'interactive' ? [] : (galleryImages.value ?? [])
  )

  const displayedCount = computed(() =>
    displayedCraftItems.value.length + displayedGalleryItems.value.length
  )

  const slideDirection = ref('')
  watch(activeFilter, (newVal, oldVal) => {
    const order = ['all', 'interactive', 'visual']
    slideDirection.value = order.indexOf(newVal) > order.indexOf(oldVal) ? 'slide-right' : 'slide-left'
  })

  return {
    activeFilter,
    filterTabs,
    displayedCraftItems,
    displayedGalleryItems,
    displayedCount,
    slideDirection,
  }
}
