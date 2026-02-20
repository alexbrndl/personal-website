---
title: Animer les transitions d'icônes
component: AnimatingIcons
cover: /videos/craft/animating-icons.webm
date: 2026-02-20
description: Trois niveaux d'animation sur un bouton Like pour montrer comment opacity, scale et blur transforment une simple icône en micro-interaction satisfaisante.
featured: true
tags:
  - Vue.js
  - CSS
  - Animation
  - Transition
---

Un bouton Like, c'est un toggle binaire : coeur vide, coeur rempli. L'état change en un clic. Mais la façon dont l'icône passe d'un état à l'autre change complètement la perception de l'interface. Ici, je montre trois niveaux de polish sur exactement la même interaction.

:craft-demo{is="AnimatingIcons" legend="Cliquez chaque bouton pour comparer les trois niveaux d'animation"}

## Contexte

J'ai choisi un bouton Like avec compteur parce que c'est une interaction que tout le monde connaît et qui permet de montrer deux choses en parallèle : la transition de l'icône et celle du texte.

Le "full animation" n'est pas nouveau dans ce portfolio. C'est exactement le pattern que j'utilise pour le bouton Send de la [toolbar flottante](/craft/floating-toolbar#la-machine-d%C3%A9tats-du-send) : opacity + scale + blur via `<Transition>`. L'objectif ici est de déconstruire ce pattern en montrant ce qui se passe quand on retire des couches.

## Pas d'animation

:craft-demo{is="AnimatingIcons" variant="none" legend="Cliquez pour voir le swap instantané"}

Le niveau zéro. Un swap instantané : l'icône outline disparaît, l'icône remplie apparaît. Le compteur change. Rien ne bouge.

```vue
<Heart
  :fill="liked ? 'currentColor' : 'none'"
  :stroke-width="liked ? 0 : 2"
/>
```

Pas de `<Transition>`, pas de CSS supplémentaire. L'icône Lucide accepte `fill` et `stroke-width` comme props, donc on toggle directement les attributs SVG.

Ça fonctionne, techniquement. L'utilisateur comprend que l'action a été prise en compte. Mais le changement est tellement abrupt qu'il donne l'impression d'un glitch plutôt que d'une réponse intentionnelle. L'oeil humain ne peut pas suivre un changement instantané. Il le subit.

## Opacity seule

:craft-demo{is="AnimatingIcons" variant="opacity" legend="Cliquez pour voir le fondu"}

On ajoute une seule propriété : `opacity`. Les deux icônes coexistent pendant la transition : l'ancienne sort en fondu, la nouvelle entre en fondu, en même temps.

```css
.fade-icon-enter-active,
.fade-icon-leave-active {
  transition: opacity 0.3s ease;
}

.fade-icon-leave-active {
  position: absolute;
}

.fade-icon-enter-from,
.fade-icon-leave-to {
  opacity: 0;
}
```

Le `position: absolute` sur l'élément sortant permet aux deux icônes de se superposer sans décaler le bouton. Sans lui, le bouton doublerait de largeur pendant 300ms.

C'est déjà mieux. Le changement est perceptible comme une transition, pas comme un remplacement. Mais le fondu seul manque de direction. L'icône apparaît "à plat", au même endroit, à la même taille. C'est propre mais un peu plat.

## L'animation complète

:craft-demo{is="AnimatingIcons" variant="full" legend="Cliquez pour voir opacity + scale + blur"}

Le troisième niveau ajoute deux propriétés à `opacity` : `scale` et `filter: blur()`. L'icône entre en grossissant depuis 25% de sa taille avec un flou de 4px qui se dissipe.

```css
.full-icon-enter-active,
.full-icon-leave-active {
  transition: opacity 0.3s ease,
              scale 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.3s ease;
}

.full-icon-leave-active {
  position: absolute;
}

.full-icon-enter-from,
.full-icon-leave-to {
  opacity: 0;
  scale: 0.25;
  filter: blur(4px);
}
```

Le `scale: 0.25` donne cette impression de matérialisation. L'icône ne glisse pas, elle émerge. Combinée au blur, elle semble se condenser depuis un état diffus. C'est le même effet que le [bouton Send de la floating toolbar](/craft/floating-toolbar#la-machine-d%C3%A9tats-du-send) pour les transitions Arrow, Loader, Check.

## La direction du compteur

Le compteur du niveau "full" ne fait pas un simple fade. Il glisse verticalement : vers le haut quand le nombre augmente (like), vers le bas quand il diminue (unlike). Ça renforce la sémantique de l'action.

```vue
<Transition :name="liked ? 'slide-count-down' : 'slide-count-up'">
  <span :key="count" class="like-btn-count">{{ count }}</span>
</Transition>
```

Le nom de la transition est dynamique. Quand l'utilisateur like, l'ancien nombre sort par le haut et le nouveau entre par le bas, comme un compteur mécanique. À l'unlike, l'inverse. Le `overflow: hidden` sur le wrapper empêche le nombre de déborder pendant le slide.

Ce détail paraît anodin, mais il connecte l'animation à l'intention. Un fade n'a pas de direction, il dit juste "ça change". Un slide vertical dit "ça monte" ou "ça descend", ce qui est exactement la sémantique d'un compteur.

## Pourquoi trois propriétés suffisent

Le pattern opacity + scale + blur revient souvent dans les interfaces modernes. Ce qui le rend efficace, c'est que chaque propriété joue un rôle différent dans la perception :

`opacity` gère la visibilité. Sans elle, l'icône apparaîtrait en pleine taille avec un flou, ce qui serait dérangeant. Elle lisse l'entrée et la sortie.

`scale` apporte le mouvement. C'est elle qui crée la sensation de matérialisation. De 0.25 à 1, l'icône "grandit" vers sa taille finale. L'easing `cubic-bezier(0.4, 0, 0.2, 1)` (standard Material) donne une décélération naturelle.

`filter: blur()` est le détail qui fait la différence. Sans blur, on a un zoom classique. Avec, l'icône semble sortir du flou comme un objet qui fait sa mise au point.

Le tout en 300ms. Plus court, l'effet est à peine perceptible. Plus long, ça ralentit l'interaction. 300ms, c'est le sweet spot pour une micro-interaction qui doit être ressentie sans être attendue.
