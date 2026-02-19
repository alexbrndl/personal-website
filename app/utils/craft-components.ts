export const craftComponentNames = ['ButtonMicro', 'FloatingToolbar'] as const

export type CraftComponentName = (typeof craftComponentNames)[number]
