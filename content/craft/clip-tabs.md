---
title: Tabs animées en clip-path
component: ClipTabsDemo
date: 2026-02-21
cover: /videos/craft/cliptabs.webm
description: Un indicateur de tab qui glisse entre les éléments grâce à clip-path et deux couches superposées, sans JavaScript pour l'animation.
featured: false
tags:
  - Vue.js
  - CSS
  - Animation
  - Reka UI
---

Les filtres d'une page, c'est souvent trois boutons avec un `background-color` sur l'actif. Ça fonctionne, mais le changement d'état est abrupt : le fond disparait d'un côté, apparait de l'autre. J'ai voulu que l'indicateur *glisse* d'un tab à l'autre, comme une fenêtre qui se déplace. Le tout en CSS pur, avec `clip-path`.

:craft-demo{is="ClipTabsDemo" legend="Cliquez les tabs pour voir l'indicateur glisser"}

## L'approche classique

La première idée, c'est de mettre une classe `.active` sur le tab sélectionné avec une transition CSS.

::craft-demo
---
show-slow: true
is: ClipTabsDemo
legend: Cliquez pour voir la transition par élément
variant: classic
---
::

```css
.tab-trigger {
  color: var(--color-text-muted);
  background: transparent;
  transition: color 0.25s ease, background-color 0.25s ease;
}

.tab-trigger--active {
  background-color: var(--color-bg-accent);
  color: var(--color-accent);
}
```

Le fond apparait et disparait sur chaque tab indépendamment. Il n'y a pas de lien visuel entre les deux états. L'oeil voit deux événements séparés (un fade-out + un fade-in) plutôt qu'un mouvement continu. Pour créer cette continuité, il faut un seul élément qui se déplace.

## Deux couches superposées

Le principe : dupliquer la liste de tabs. La première couche affiche les tabs dans leur état normal (texte muted, fond transparent). La seconde, posée par-dessus, affiche les mêmes tabs avec le style actif (fond accent, texte accent). Un `clip-path` sur cette seconde couche ne révèle que la zone du tab actif.

::craft-demo
---
show-slow: true
is: ClipTabsDemo
legend: Cochez "Voir les couches" pour séparer les deux layers
variant: layers
---
::

```vue
<TabsList class="tabs-list">
  <!-- Couche 1 : tabs normales (cliquables) -->
  <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value">
    {{ tab.label }}
  </TabsTrigger>

  <!-- Couche 2 : overlay clippé (non-interactif) -->
  <TabsIndicator as-child>
    <div class="tabs-overlay" aria-hidden="true">
      <div class="tabs-overlay-list">
        <span v-for="tab in tabs" :key="tab.value">
          {{ tab.label }}
        </span>
      </div>
    </div>
  </TabsIndicator>
</TabsList>
```

L'overlay a `pointer-events: none` et `aria-hidden="true"`. Les clics passent à travers vers les vrais `TabsTrigger` en dessous. L'overlay est purement visuel.

## Le clip-path

`clip-path: inset()` découpe un rectangle dans l'overlay. En animant les valeurs de découpe, le rectangle visible glisse d'un tab à l'autre.

```css
.tabs-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: clip-path 0.25s ease;
  clip-path: inset(
    0
    calc(100% - var(--position) - var(--size))
    0
    var(--position)
    round 1rem
  );
}
```

`inset()` prend quatre valeurs dans l'ordre : top, right, bottom, left. Le top et le bottom sont à `0` (toute la hauteur). Le left est la position du tab actif. Le right est calculé par soustraction : `100% - position - taille` donne l'espace restant à droite du tab actif.

Le `round 1rem` arrondit les coins du rectangle découpé pour suivre le `border-radius` des tabs.

## Les variables CSS de Reka UI

Le calcul du clip-path a besoin de deux informations : la position et la taille du tab actif. Reka UI fournit exactement ça via `TabsIndicator`.

Quand on utilise `TabsIndicator` avec la prop `as-child`, le composant n'ajoute pas de DOM. Il injecte deux CSS custom properties sur son enfant direct : `--reka-tabs-indicator-position` (offset left en pixels) et `--reka-tabs-indicator-size` (largeur en pixels).

```css
clip-path: inset(
  0
  calc(100% - var(--reka-tabs-indicator-position) - var(--reka-tabs-indicator-size))
  0
  var(--reka-tabs-indicator-position)
  round 1rem
);
```

Ces variables sont mises à jour automatiquement par Reka UI quand le tab actif change. Pas de `ref`, pas de `watch`, pas de `getBoundingClientRect()`. Le clip-path est entièrement déclaratif en CSS.

C'est le détail qui rend cette approche satisfaisante à implémenter. Sans `TabsIndicator`, il faudrait un `ResizeObserver` ou un recalcul au clic pour mesurer la position de chaque tab. Ici, Reka fait ce travail et l'expose sous forme de variables CSS consommables directement dans le `clip-path`.
