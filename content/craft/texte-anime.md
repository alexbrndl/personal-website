---
title: Texte animé
component: TextRevealDemo
date: 2026-02
description: Rotation de mots avec des transitions fluides de blur et de translation pour un effet de révélation élégant.
featured: true
tags:
  - Vue.js
  - Animation
  - CSS
---

## Contexte

Un texte statique peut devenir vivant avec une simple rotation de mots. Ce composant explore une transition de type « reveal » qui combine opacité, translation verticale et flou gaussien pour un effet naturel et raffiné.

## Démo

:craft-demo{is="TextRevealDemo" legend="Rotation de mots avec blur transition"}

## Approche technique

L'animation utilise uniquement des transitions CSS sur trois propriétés — `opacity`, `transform` et `filter: blur()` — orchestrées par un intervalle JavaScript qui alterne la visibilité.

```css
.word {
  transition: opacity 0.4s ease, transform 0.4s ease, filter 0.4s ease;
}

.word:not(.is-visible) {
  opacity: 0;
  transform: translateY(6px);
  filter: blur(4px);
}
```

Le timing est calibré pour que la sortie (400ms) se termine avant l'entrée du mot suivant, créant une pause subtile qui donne du rythme à la séquence.
