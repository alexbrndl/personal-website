export const craftComponentNames = ['ButtonMicro', 'TextRevealDemo'] as const

export type CraftComponentName = (typeof craftComponentNames)[number]
