import type { Ref } from 'vue'

export function useFilteredCraft<C, G>(
  craftItems: Ref<C[] | null | undefined>,
  galleryImages: Ref<G[] | null | undefined>,
) {
  const activeFilter = ref<'all' | 'interactive' | 'visual'>('all')

  const displayedCraftItems = computed(() =>
    activeFilter.value === 'visual' ? [] : (craftItems.value ?? [])
  )

  const displayedGalleryItems = computed(() =>
    activeFilter.value === 'interactive' ? [] : (galleryImages.value ?? [])
  )

  const displayedCount = computed(() =>
    displayedCraftItems.value.length + displayedGalleryItems.value.length
  )

  return { activeFilter, displayedCraftItems, displayedGalleryItems, displayedCount }
}
