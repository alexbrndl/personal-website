---
title: Toolbar contextuelle flottante
component: FloatingToolbar
cover: /videos/craft/floating-toolbar.webm
date: 2026-02-20
description: Une toolbar de formatage qui pivote entre un panneau d'édition et un panneau AI via une animation CSS Grid, sans JavaScript pour les transitions.
featured: true
tags:
  - Vue.js
  - CSS Grid
  - Animation
  - Reka UI
  - CSS
---

Sélectionner du texte dans un éditeur moderne, c'est le déclencheur d'une interface entière. La toolbar apparait, propose du formatage, et dans les éditeurs récents, un accès direct à l'IA. Le défi ici : animer la transition entre ces deux panneaux dans un espace contraint, sans que rien ne saute ou ne déborde.

::craft-demo
---
show-slow: true
is: FloatingToolbar
legend: "Cliquez sur le texte, puis explorez la toolbar : toggles de formatage,
  bouton Ask AI, envoi"
variant: text
---
::

## Contexte

J'utilise Notion et Linear au quotidien, et leur toolbar contextuelle m'a toujours fasciné. Le moment où tu cliques "Ask AI" et que le panneau de formatage se replie pour laisser place à un champ de saisie, c'est une transition fluide dans un espace très restreint. J'ai voulu reproduire ce pattern en CSS pur, sans librairie d'animation, pour comprendre ce qui le rend satisfaisant.

Le composant `<Transition>` de Vue gère déjà les entrées/sorties d'éléments dans le DOM. Pour le reste, les transitions CSS natives sur `grid-template-columns` suffisent. Pas besoin de GSAP ou de librairie d'animation ici.

## Le swap CSS Grid

Le coeur du composant, c'est une grille à trois colonnes. Le panneau de formatage à gauche, le bouton AI au centre, et le panneau AI à droite.

:pros-figure{src="/images/craft/floating-toolbar-grid.svg" alt="Schéma du swap CSS Grid : la colonne 1fr se réduit à 0fr tandis que la colonne 0fr s'étend à 1fr, le bouton AI reste fixe en auto" caption="Le bouton AI sert de pivot fixe entre les deux panneaux"}

L'astuce tient en deux lignes :

```css
.toolbar {
  display: grid;
  grid-template-columns: 1fr auto 0fr;
  transition: grid-template-columns 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.toolbar--ai {
  grid-template-columns: 0fr auto 1fr;
}
```

Quand on passe en mode AI, la colonne 1 passe de `1fr` à `0fr` et la colonne 3 fait l'inverse. Le bouton central reste en `auto` : il ne bouge pas, il sert de pivot. CSS Grid interpole nativement entre les valeurs `fr`, donc la transition est fluide sans aucun JavaScript.

Le `0fr` plutôt que `0px` est important. Avec `0px`, la colonne disparait d'un coup. Avec `0fr`, elle se réduit progressivement parce que Grid continue de la traiter comme une fraction de l'espace disponible, même quand cette fraction vaut zéro.

## Le verrouillage de largeur

La grille seule ne suffit pas. Quand la colonne de formatage se réduit, la toolbar entière se contracte puisqu'elle perd du contenu. Le résultat : un toolbar qui rétrécit puis regrandit, un effet accordéon disgracieux.

La solution : mesurer la largeur totale au montage et la figer.

```ts
onMounted(() => {
  if (toolbarEl.value) {
    toolbarWidth.value = toolbarEl.value.offsetWidth
    // ...
    formatWidth.value = formatEl.offsetWidth - sepWidth - gapDiff
  }
})
```

Deux mesures sont nécessaires. `toolbarWidth` verrouille le conteneur pour que sa taille ne change jamais. `formatWidth` capture la largeur du panneau de formatage et l'applique au panneau AI, pour que les deux occupent exactement le même espace. Sans cette égalité, le contenu du panneau AI forcerait une largeur différente et la toolbar sauterait à la fin de la transition.

Le calcul de `formatWidth` soustrait la largeur du séparateur et ajuste le `gap`, parce que le panneau AI a un `gap` de 6px entre l'input et le bouton send, alors que le panneau de formatage a un espacement différent entre ses éléments.

## Le masquage de l'overflow

Quand une colonne se réduit à `0fr`, son contenu ne disparait pas : il déborde. Les boutons de formatage continuent d'exister, ils dépassent juste du conteneur. `overflow: hidden` sur la toolbar règle ça, mais crée un autre problème : le `border-radius: 99px` de la toolbar coupe visuellement les éléments aux extrémités pendant la transition.

```css
.toolbar::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 4px var(--color-bg);
  pointer-events: none;
  z-index: 1;
}
```

Un pseudo-élément avec un `box-shadow` inset de la couleur du fond crée un "cadre" intérieur qui masque les bords. Le contenu qui déborde pendant la transition est caché sous ce cadre, sans artefact visuel.

## Le bouton pivot

::craft-demo
---
show-slow: true
is: FloatingToolbar
legend: "Cliquez le bouton Send pour voir la séquence complète : envoi,
  fermeture, réouverture"
variant: toolbar
---
::

Le bouton "Ask AI" est le seul élément qui ne bouge pas pendant la transition. Il reste en colonne 2 (`auto`), donc sa position est déterminée par son propre contenu, pas par l'espace alloué. C'est le point d'ancrage visuel de toute l'animation.

Son `border-radius` suit la direction du panneau actif. En mode formatage, le bord arrondi est à droite (`6px 16px 16px 6px`) pour indiquer que le contenu est à gauche. En mode AI, il bascule à gauche (`16px 6px 6px 16px`). Ce détail oriente visuellement le regard vers le panneau actif.

```css
.toolbar-btn--ai {
  border-radius: 6px 16px 16px 6px;
}

.toolbar-btn--ai-active {
  border-radius: 16px 6px 6px 16px;
  gap: 6px;
}
```

Le label du bouton alterne entre "Ask AI" et "Close AI" avec un flip vertical. Les deux textes sont empilés dans un conteneur avec `overflow: hidden`, et un `translateY(-50%)` fait défiler vers le second. La durée de ce flip est synchronisée avec la transition de la grille via la même variable CSS `--toolbar-duration`.

## La machine d'états du send

Le bouton d'envoi traverse trois états : `idle`, `loading`, `success`. Le même pattern de type union que j'avais exploré dans [les micro-interactions de bouton](/craft/micro-interactions-bouton#la-machine-d%C3%A9tats) empêche les états contradictoires.

```ts
const sendState = ref<'idle' | 'loading' | 'success'>('idle')

function handleSend() {
  if (sendState.value !== 'idle') return
  sendState.value = 'loading'

  setTimeout(() => {
    sendState.value = 'success'
    setTimeout(() => {
      toolbarVisible.value = false
      // ...
    }, 800)
  }, 1500)
}
```

L'icône change via `<Transition>` avec un effet de scale + blur. Chaque icône entre en grossissant depuis 25% avec un flou de 4px, et sort de la même manière. Le `position: absolute` sur l'état sortant permet aux deux icônes de coexister brièvement sans décaler le bouton.

```css
.send-icon-enter-from {
  opacity: 0;
  scale: 0.25;
  filter: blur(4px);
}
```

Le blur donne l'impression que l'icône "se matérialise", un effet plus organique qu'un simple fondu.

## Le shimmer AI

Quand le mode AI est actif, le texte sélectionné passe en dégradé animé dans les tons verts. C'est un `linear-gradient` avec `background-clip: text`, animé en décalant la `background-position`.

```css
.demo-highlight--ai {
  background: linear-gradient(90deg,
    var(--color-malachite-300), var(--color-malachite-500),
    var(--color-malachite-300), var(--color-malachite-500),
    var(--color-malachite-300));
  background-size: 200% 100%;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 0.5s linear infinite;
}
```

Le gradient est doublé (`background-size: 200%`) pour que le défilement crée une boucle continue. Sans ça, l'animation saute à chaque cycle. Le `-webkit-text-fill-color: transparent` est nécessaire en plus de `background-clip: text` pour que le dégradé soit visible à travers le texte dans tous les navigateurs.

J'ai eu un problème avec le dark mode : les mêmes teintes de vert ne fonctionnaient pas sur fond sombre. Les variantes `malachite-300`/`500` étaient trop sombres et le texte devenait illisible. La solution a été de passer à `malachite-200`/`600` en dark mode via un sélecteur `html.dark`, ce qui élargit le contraste du gradient.

## Le positionnement

La toolbar est positionnée en absolu au-dessus du mot "selected text". Le calcul se fait au montage avec `getBoundingClientRect()` :

```ts
if (markEl.value && contentEl.value) {
  const markRect = markEl.value.getBoundingClientRect()
  const contentRect = contentEl.value.getBoundingClientRect()
  toolbarLeft.value = markRect.left + markRect.width / 2 - contentRect.left
  toolbarBottom.value = contentRect.height - (markRect.top - contentRect.top) + 16
}
```

Le `left` centre la toolbar horizontalement sur le mot, combiné avec un `transform: translateX(-50%)` en CSS. Le `bottom` la place 16px au-dessus du texte. Ces valeurs sont calculées une seule fois et ne changent pas, parce que le layout du texte est statique. Sur un vrai éditeur, il faudrait recalculer à chaque scroll ou redimensionnement.

L'apparition et la disparition de la toolbar utilisent un combo `opacity` + `transform` : elle entre en fondu tout en montant légèrement et en grossissant depuis 80%. La disparition fait l'inverse, avec un `pointer-events: none` pour éviter que la toolbar invisible ne bloque les clics.
