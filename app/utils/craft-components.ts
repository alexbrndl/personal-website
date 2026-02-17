export const craftComponentNames = ['ButtonDemo', 'TextRevealDemo'] as const

export type CraftComponentName = (typeof craftComponentNames)[number]
