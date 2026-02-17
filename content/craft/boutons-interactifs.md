---
title: Boutons interactifs
component: ButtonDemo
date: 2026-02
description: Exploration de micro-interactions sur des boutons avec des transitions fluides et du feedback visuel.
featured: true
tags:
  - Vue.js
  - Animation
  - CSS
---

## Contexte

Les micro-interactions transforment une interface fonctionnelle en une expérience mémorable. Ce composant explore différentes approches d'animation sur des boutons — du feedback au clic jusqu'aux transitions d'état.

## Démo

:craft-demo{is="ButtonDemo" legend="test"}

## Approche technique

L'animation repose sur des transitions CSS natives combinées avec des changements d'état Vue. Pas de librairie externe, juste du CSS et de la réactivité.

```css
.btn {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn:active {
  transform: scale(0.97);
}
```

L'objectif est de garder les animations sous 200ms pour qu'elles soient perçues comme instantanées, tout en ajoutant assez de mouvement pour donner du caractère à l'interface.
