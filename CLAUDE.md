# Personal Website

Portfolio d'Alexandre Brondel (alexbrndl.com), construit en Nuxt 4 avec Nuxt Content.

## Stack

- Nuxt 4, Vue 3 Composition API, TypeScript
- CSS vanilla avec variables CSS (`app/assets/css/main.css`), pas de Tailwind
- GSAP pour les animations complexes
- Lucide (`lucide-vue-next`) pour les icones
- Reka UI pour les primitives accessibles
- Deploiement sur Vercel

## Architecture craft

Le site a une section "craft" qui presente des composants interactifs avec une page d'explication.

### Fichiers

- `app/components/craft/` : composants Vue interactifs
- `content/craft/` : pages markdown (syntaxe MDC)
- `app/utils/craft-components.ts` : registre des composants (type union)
- `app/components/content/CraftDemo.vue` : wrapper qui affiche un composant craft dans une page markdown

### Ajouter un craft

1. Creer le composant dans `app/components/craft/`
2. L'ajouter dans `craft-components.ts`
3. L'importer et le mapper dans `CraftDemo.vue`
4. Creer la page markdown dans `content/craft/`

### Syntaxe MDC pour les demos

```markdown
:craft-demo{is="NomComposant" legend="Instruction d'interaction"}
:craft-demo{is="NomComposant" variant="x" legend="Instruction"}
```

La prop `variant` permet d'afficher un sous-ensemble du composant dans les sections techniques.

## Patterns d'animation Vue

### Transition simultanee (pas de mode="out-in")

Pour les swaps d'icones ou d'elements visuels, ne PAS utiliser `mode="out-in"`. Utiliser une transition simultanee avec `position: absolute` sur l'element sortant :

```css
.my-transition-leave-active {
  position: absolute;
}
```

### Pattern opacity + scale + blur

Le pattern recurrent pour les micro-interactions :

```css
.enter-from, .leave-to {
  opacity: 0;
  scale: 0.25;
  filter: blur(4px);
}
```

Utilise dans le bouton Send (FloatingToolbar) et les transitions d'icones (AnimatingIcons).

## Contenu

- Pages craft redigees en francais, premiere personne
- Code et commits en anglais
- Pas de tirets cadratins dans le contenu redige
- Concision : ne pas sur-expliquer apres les snippets de code. Si le code parle de lui-meme, un paragraphe court suffit.
- Titres de section concrets et descriptifs, pas abstraits ou "creatifs"
- Skill `/craft-page` pour generer ou revoir les pages craft

## Test

`app/pages/test.vue` (gitignore) sert a tester les composants en isolation.
