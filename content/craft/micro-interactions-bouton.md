---
title: Micro-interactions de bouton
component: ButtonMicro
date: 2026-02
description: Exploration des patterns de feedback sur des boutons, du scale CSS aux transitions d'état GSAP en passant par les effets de hover créatifs.
featured: true
tags:
  - Vue.js
  - GSAP
  - Animation
  - CSS
  - Accessibilité
---

Un bouton, c'est le point de contact le plus courant entre un utilisateur et une interface. C'est aussi un terrain de jeu inépuisable : comment il réagit au survol, communique un chargement, confirme une action ou signale une erreur. Ici, j'explore ces possibilités une par une.

## Contexte

Je me suis souvent retrouvé à copier-coller des snippets d'animation de bouton d'un projet à l'autre sans vraiment les comprendre ou les pousser. L'idée ici, c'est de prendre le temps d'explorer chaque technique en profondeur : partir du feedback CSS le plus simple et progresser vers des effets plus ambitieux avec GSAP.

## Le feedback de base

:craft-demo{is="ButtonMicro" variant="hover" legend="Survolez puis cliquez le bouton"}

Deux `transform` suffisent :

```css
.btn:hover  { transform: scale(1.02); }
.btn:active { transform: scale(0.98); }
```

L'écart est volontairement faible. Au-delà de 2%, ça devient caricatural. La `transition` à 150ms fait le reste : assez rapide pour paraître instantané, assez lent pour être perçu.

## L'effet ripple

:craft-demo{is="ButtonMicro" variant="ripple" show-slow legend="Cliquez plusieurs fois à différents endroits du bouton"}

À chaque clic, on calcule la position relative du curseur via `getBoundingClientRect()`, on pousse un objet `{ id, x, y }` dans un tableau réactif, et GSAP anime le `<span>` correspondant en `scale: 4` + `opacity: 0`.

```ts
ripples.value.push({ id, x, y })

nextTick(() => {
  const el = button.querySelector(`[data-ripple-id="${id}"]`)
  gsap.fromTo(el,
    { scale: 0, opacity: 0.3 },
    { scale: 4, opacity: 0, duration: 0.6, ease: 'power2.out',
      onComplete: () => {
        ripples.value = ripples.value.filter(r => r.id !== id)
      }
    })
})
```

Le `nextTick` est crucial : Vue doit d'abord rendre le `<span>` avant que GSAP puisse le cibler. En `onComplete`, on retire le ripple du tableau pour nettoyer le DOM.

## La machine d'états

:craft-demo{is="ButtonMicro" variant="states" show-slow legend="Cliquez pour lancer la séquence idle → loading → success → idle"}

La tentation c'est d'utiliser des booléens (`isLoading`, `isSuccess`), mais rien n'empêche d'avoir les deux à `true`. Un type union résout ça. Un seul ref, un seul état possible :

```ts
type ButtonState = 'idle' | 'loading' | 'success'
const buttonState = ref<ButtonState>('idle')
```

Le contenu change via `<Transition name="fade" mode="out-in">`. Le `mode="out-in"` garantit que l'ancien sort avant que le nouveau entre. Sans ça, les deux coexistent un instant et le bouton "saute".

## Les transitions GSAP

:craft-demo{is="ButtonMicro" variant="loading-success" show-slow legend="Cliquez, comparez avec la version CSS au-dessus : le check bounce, le fond s'anime"}

Les classes CSS ne suffisent plus dès qu'on veut un bounce pour le succès et un fondu pour le loading. L'approche : `<Transition :css="false">` avec des hooks `@leave` et `@enter`. Vue gère quand ajouter/retirer du DOM, GSAP gère comment.

```vue
<Transition :css="false" mode="out-in" @leave="lsLeave" @enter="lsEnter">
  <span v-if="lsState === 'idle'" key="idle">Envoyer</span>
  <span v-else-if="lsState === 'loading'" key="loading">Envoi…</span>
  <span v-else-if="lsState === 'success'" key="success">Envoyé</span>
</Transition>
```

Le hook `@leave` reçoit l'élément et un callback `done`. On anime la sortie, puis `done()` dit à Vue de retirer l'élément. Chaque état a sa propre animation : fondu simple pour idle, shrink pour le spinner, et pour success → idle, on anime aussi le `backgroundColor` du bouton.

```ts
function lsEnter(el: Element, done: () => void) {
  if (lsState.value === 'success') {
    gsap.to(btn, { backgroundColor: '#22c55e', duration: 0.3 })
    gsap.fromTo(el,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)', onComplete: done })
  }
}
```

Un piège : j'avais mis le `clearProps: 'backgroundColor'` dans la fonction qui change l'état. Le fond vert disparaissait instantanément avant la transition. En déplaçant l'animation dans le hook `@leave`, tout se séquence correctement. Le `clearProps` est important : GSAP pose des styles inline qui prennent le dessus sur le CSS.

## Le shake d'erreur

:craft-demo{is="ButtonMicro" variant="error" show-slow legend="Cliquez, activez le slow mode pour voir le shake frame par frame"}

Une timeline GSAP avec des `.to()` chaînés sur l'axe X. L'amplitude décroît pour donner un tremblement naturel :

```ts
const tl = gsap.timeline()
tl.to(btn, { x: -8, duration: 0.05 })
  .to(btn, { x: 8, duration: 0.05 })
  .to(btn, { x: -6, duration: 0.05 })
  .to(btn, { x: 6, duration: 0.05 })
  .to(btn, { x: -3, duration: 0.05 })
  .to(btn, { x: 3, duration: 0.05 })
  .to(btn, { x: 0, duration: 0.05 })
tl.to(btn, { backgroundColor: '#ef4444', duration: 0.2 }, 0)
```

Le fond rouge est posé en parallèle avec le position parameter `0`. Le `gsap.set(btn, { transition: 'none' })` est indispensable : la `transition: transform` du CSS absorbe les changements rapides sinon, et le bouton glisse au lieu de trembler. `clearProps: 'backgroundColor,transition'` rend le contrôle au CSS à la fin.

## Les effets de hover

:craft-demo{is="ButtonMicro" variant="hover-effects" show-slow legend="Survolez les trois boutons : glow, magnetic et bordure animée"}

Le **glow** suit le curseur via un `radial-gradient` positionné sur `--glow-x`/`--glow-y`, mis à jour à chaque `mousemove`. Pas de GSAP ici, le suivi doit être instantané.

Le **magnétique** utilise `gsap.quickTo()` : un tween réutilisable qu'on redirige à chaque event sans recréer d'objet. Le `/ 3` atténue le déplacement pour garder l'effet d'attraction :

```ts
xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power2.out' })
yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power2.out' })

// À chaque mousemove
xTo((event.clientX - centerX) / 3)
yTo((event.clientY - centerY) / 3)
```

Au `mouseleave`, un `elastic.out` ramène le bouton avec un rebond.

La **bordure animée** est un `conic-gradient` sur un wrapper avec `padding: 2px`. GSAP anime l'angle avec `modifiers` pour le modulo 360, `ease: 'none'` pour une rotation constante.

## L'accessibilité

Les boutons d'état utilisent `aria-live="polite"`, `"assertive"` pour les erreurs. `aria-disabled` bloque les clics pendant une animation.

Pour `prefers-reduced-motion`, `gsap.matchMedia()` pousse le `timeScale` à 100 :

```ts
gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
  gsap.globalTimeline.timeScale(100)
  return () => { gsap.globalTimeline.timeScale(1) }
})
```

J'avais d'abord mis `0`, mais ça gèle tout y compris les `delayedCall`. Les boutons restaient bloqués en loading.

Le `onUnmounted` kill les tweens en cours. Sans ça, les animations tentent de modifier des éléments DOM qui n'existent plus.
