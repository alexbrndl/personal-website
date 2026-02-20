export const craftComponentNames = ['AnimatingIcons', 'ButtonMicro', 'FloatingToolbar'] as const

export type CraftComponentName = (typeof craftComponentNames)[number]
