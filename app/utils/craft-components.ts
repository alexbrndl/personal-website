export const craftComponentNames = ['AnimatingIcons', 'ButtonMicro', 'ClipTabsDemo', 'FloatingToolbar'] as const

export type CraftComponentName = (typeof craftComponentNames)[number]
