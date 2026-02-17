---
title: Concevoir et développer un plugin Figma de palettes accessibles, adopté par 32 000+ designers
cover: /images/color-shades/cover.png
date: 2026-02-01
description: Né d'une frustration personnelle avec les outils existants, ce plugin génère des palettes de 11 nuances accessibles par défaut en un clic. Algorithme en OKLCH, accessibilité intégrée (WCAG 2.1 + APCA), trois versions itérées sur des retours réels.
featured: true
role: Design Engineer
tags:
  - Figma Plugin
  - Design + Dev
  - a11y
  - 32k+ users
url: https://www.figma.com/community/plugin/1050457414903366814/color-shades-oser
---

## Introduction

### Le projet

color shades \[oser] est un plugin Figma qui génère des palettes de couleurs complètes (11 nuances du clair au foncé) à partir d'une seule couleur de base. Un designer choisit sa couleur de marque et le plugin produit instantanément une palette cohérente, harmonieuse et accessible.

### Mon rôle

Seul designer et développeur. De la conception du produit à l'algorithme de génération, de l'interface utilisateur au code Vue.js, du lancement sur le Figma Community aux itérations basées sur les retours utilisateurs.

### Le déclencheur

Les designers passent des heures à construire leurs palettes de couleurs à la main, nuance par nuance. Les plugins existants ? Soit trop basiques (résultats visuels médiocres), soit trop techniques et surchargés, soit devenus payants, comme **[Tailwind CSS Color Generator](https://www.figma.com/community/plugin/1242548152689430610/tailwind-css-color-generator)**, que j'utilisais au quotidien.

Plutôt que de subir ces compromis, j'ai voulu construire l'outil qui manquait : un plugin gratuit qui produit des palettes de qualité pro en un clic, avec une expérience aussi soignée que le résultat qu'il génère.

:pros-figure{caption="color shades [oser] v2.1" src="/images/color-shades/intro.png"}

## Le problème

### Problème utilisateur

Les designers passent des heures à construire leurs palettes à la main. Les plugins existants produisent des résultats visuellement médiocres ou sont surchargés de fonctions complexes qui rebutent plutôt qu'elles n'aident.

### Problème écosystème

Il n'existe pas d'outil dans Figma qui génère des nuanciers perceptuellement uniformes, accessibles, et directement exploitables en Variables ou Styles. Les équipes sont forcées de bricoler manuellement ou d'accepter des compromis de qualité.

:pros-figure{caption="Différences entre une génération HSL vs OKLCH" src="/images/color-shades/problem.png"}

## Reverse engineering des palettes Tailwind : comprendre pour mieux générer

### Contexte

La v1 du plugin fonctionnait en HSL. Les palettes générées avaient des tons moyens boueux et des progressions visuellement inégales. La découverte d'OKLCH (via [oklch.fyi](https://oklch.fyi/)) et son adoption par Tailwind v4 ont confirmé l'intuition : HSL n'est pas perceptuellement uniforme.

### Le tournant

La solution évidente était de reproduire directement les palettes Tailwind, des valeurs fixes, prêtes à l'emploi. Mais des valeurs figées ne génèrent rien : elles fonctionnent pour les couleurs prédéfinies de Tailwind, pas pour une couleur de marque arbitraire.

Il fallait comprendre pourquoi ces palettes marchent. En extrayant les valeurs des 17 palettes de couleurs de Tailwind v4, j'ai pu analyser les courbes qui les gouvernent : luminosité, saturation et teinte. C'est cette analyse qui a révélé les patterns. Comment la luminosité progresse, comment le chroma se distribue, comment les tons évoluent naturellement du froid au chaud selon leur intensité.

En appliquant ces courbes dans l'espace OKLCH, où chaque pas est perceptuellement uniforme, j'ai obtenu un algorithme capable de reproduire la qualité Tailwind pour n'importe quelle couleur d'entrée.

### Résultat

Des palettes de 11 nuances perceptuellement uniformes, avec des progressions naturelles de luminosité, de saturation et de teinte. Là où HSL produisait des sauts incohérents et des dérives de couleur.

:pros-figure{caption="Courbes moyennes calculées sur 17 palettes Tailwind v4" src="/images/color-shades/reverse-engineering.png"}

## L'accessibilité comme contrainte de génération

### Contexte

La plupart des plugins de couleur traitent l'accessibilité comme une étape séparée : on génère la palette, puis on vérifie les contrastes. Si une nuance ne passe pas, c'est à l'utilisateur de corriger manuellement. Je voulais que l'accessibilité soit intégrée directement dans la génération : chaque palette produite est conforme par défaut.

### Le tournant

Mon premier réflexe était de n'intégrer qu'APCA, le modèle de contraste le plus récent et le plus performant, pressenti pour devenir la base de WCAG 3.0. Mais dans la réalité, WCAG 2.1 reste le standard que les équipes design et les audits utilisent au quotidien. Ignorer WCAG 2.1 au profit d'APCA seul, c'était proposer un outil techniquement supérieur mais déconnecté des pratiques actuelles.

J'ai intégré les deux : WCAG 2.1 pour la conformité immédiate, APCA pour les équipes qui veulent aller plus loin. L'utilisateur choisit son référentiel, le plugin s'adapte.

Le vrai défi était l'auto-correction. Quand une nuance ne respecte pas le contraste minimum, le plugin ajuste automatiquement sa luminosité. Mais corriger trop agressivement casse la progression naturelle de la palette. Il a fallu trouver l'équilibre : corriger suffisamment pour atteindre la conformité, sans dénaturer la couleur choisie par l'utilisateur ni briser l'ordre des nuances.

### Résultat

Chaque nuance affiche son score de contraste directement dans l'interface, avec un indicateur visuel de conformité. Les palettes générées sont accessibles par défaut, pas après vérification. Les concurrents vérifient le contraste. Color Shades le corrige.

:pros-figure{caption="Score APCA calculé en temps réel - Auto-correction active - Conformité visible d'un coup d'oeil" src="/images/color-shades/accessibilit-1-2.gif"}

:pros-figure{caption="Luminosité ajustée pour atteindre le contraste minimum, sans casser la progression" src="/images/color-shades/accessibilit-2-2.gif"}

## Créer une expérience qui se démarque

### Contexte

La première ébauche de la v2 était fonctionnelle mais invisible. Les composants étaient calqués sur le design system de Figma : inputs standards, toggles verts, boutons génériques. Le résultat ressemblait à n'importe quel plugin. L'UI ne reflétait ni la qualité du moteur de génération, ni l'ambition du projet.

### Le tournant

La tentation était de rester dans les conventions Figma. C'est safe, les utilisateurs connaissent les patterns, il n'y a aucun risque d'apprentissage. Mais un plugin qui ressemble à tous les autres se noie dans le catalogue. Je voulais que l'utilisateur reconnaisse Color Shades au premier coup d'oeil.

Le pari a été de créer une identité visuelle propre tout en gardant les repères d'usage. Le color preview prend toute la largeur et montre immédiatement la couleur choisie. La valeur HEX est affichée en grand, lisible instantanément. Les options avancées (accessibilité, snap, textes nuancés) sont regroupées dans un menu repliable pour ne pas surcharger l'interface par défaut. Les options de génération (Styles, Variables, Frames) restent toujours visibles en bas car c'est l'action principale. Les scores APCA apparaissent directement sur chaque nuance pour que l'information soit là où on en a besoin.

Certains choix sont venus des utilisateurs. L'affichage multi-format et le click-to-copy ont été demandés directement. La flexibilité de saisie HEX (raccourcis, casse libre) est née de retours terrain. Le commentaire d'une utilisatrice qui trouvait la v2 "new and complex" a confirmé l'importance du menu repliable : montrer l'essentiel d'abord, les options avancées ensuite.

### Résultat

Un plugin qui a sa propre identité dans l'écosystème Figma, sans sacrifier la prise en main. L'essentiel est visible immédiatement, la profondeur est accessible en un clic.

:pros-figure{caption="Création d'une identité propre, hiérarchie claire, infos contextuelles" src="/images/color-shades/experience-1-3.png"}

:pros-figure{caption="Des paramètres avancées en un clic" src="/images/color-shades/experience-2-3.gif"}

:pros-figure{caption="Retours utilisateurs" src="/images/color-shades/feedback.png"}

## Évolution du produit

Le plugin a traversé trois étapes majeures, chacune déclenchée par un apprentissage concret :

### v1 : Le point de départ

Un générateur minimaliste en HSL. Une couleur en entrée, un nuancier en sortie. Simple mais limité : les résultats étaient visuellement inégaux et l'interface basique.

### v2 : La refonte complète

Réécriture totale avec Vue 3 et OKLCH. Ajout de l'accessibilité (WCAG + APCA), du support Figma Variables, de l'input multi-format, et d'une interface repensée avec une identité propre.

### v2.1 : Les itérations utilisateurs

Entièrement née de retours réels. Correction des cas limites (couleurs quasi-blanches, jaunes purs), amélioration du snap avec atténuation progressive, ajout du click-to-copy et de l'affichage multi-format, simplification de l'UI avec le menu Advanced Options repliable.

:pros-figure{caption="L'évolution du plugin" src="/images/color-shades/timeline.png"}

## Impact et résultats

:pros-figure{caption="Chiffres clés du plugin" src="/images/color-shades/chiffres.png"}

### Adoption

32 900+ utilisateurs et 309 likes sur le Figma Community. La v2 a multiplié par près de 3 le rythme d'adoption : de 150 nouveaux utilisateurs par semaine à plus de 400 après la refonte.

### Retours utilisateurs

Des designers qui décrivent le plugin comme un outil qui "réduit leur charge de travail de 90%" et un "time saver". Plusieurs retours spontanés ont mené directement à des améliorations concrètes dans la v2.1 : affichage multi-format, click-to-copy, flexibilité de saisie HEX, simplification de l'interface.

### Positionnement

Une alternative gratuite dans un écosystème où le concurrent de référence (Tailwind CSS Color Generator) est devenu payant. Le plugin va plus loin techniquement : génération en OKLCH, accessibilité intégrée avec auto-correction, 3 modes de sortie natifs Figma.

### Ce que ce projet démontre

Concevoir, développer et lancer un produit utilisé par plus de 32 000 designers. Identifier un problème dans son propre workflow, construire la solution, puis l'itérer sur la base de retours réels.
