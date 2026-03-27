# CLAUDE.md — Guide agent pour FitForYou

Ce fichier donne le contexte et les conventions à respecter pour contribuer au projet avec Claude.

## Contexte projet

- Application web de tracking de séances de gym.
- Stack: Next.js 16 (App Router), TypeScript, Supabase Auth, Prisma 7 + PostgreSQL, Tailwind CSS v4, shadcn/ui.
- Les données d'exercices sont dans `lib/exercises.json`.

## Règle critique Next.js

Ce projet utilise une version récente de Next.js avec des changements de conventions.
Avant toute implémentation significative, vérifier la documentation locale dans:

- `node_modules/next/dist/docs/`

Ne pas supposer les APIs des anciennes versions.

## Architecture à respecter

### 1) Pages `app/` très minces

Les fichiers de routes dans `app/` doivent rester minimalistes (3-5 lignes idéalement):
- importer un `Screen` ou une `View`
- le rendre sans logique métier

### 2) `screens/` pour l'orchestration serveur

`screens/` contient les Server Components d'orchestration:
- chargement/fetch des données
- composition des vues
- passage de props typées

### 3) `features/*` par domaine métier

- `features/*/View/`: composants de présentation (server ou client).
- `features/*/services/`: Server Actions (`'use server'`) et logique d'action.
- `features/*/repositories/`: accès aux données via Prisma — fonctions async pures, pas de `'use server'`, appelées uniquement depuis les `screens/`.

**Règle Prisma** : ne jamais importer `prisma` directement dans un `screen/`. Passer obligatoirement par un repository.

### 4) Types par feature

- Définir les types du domaine dans `features/<domaine>/types/` (souvent un `index.ts` qui réexporte).
- Y placer les alias Prisma (`GetPayload` / modèles générés) et les props des Views de ce domaine.
- Importer depuis le barrel du domaine, ex. `@/features/exercises/types`.

## Structure de référence

```txt
app/
  (auth)/            login, signup
  (dashboard)/       dashboard, exercises, sessions, profile

screens/             orchestration serveur des pages

features/
  auth/
    View/
    services/
  dashboard/
    View/
    types/           # props Dashboard, types Prisma du domaine
    repositories/    # ex: getDashboardData(userId)
  exercises/
    View/
    types/
    repositories/    # ex: findExercises(filters), getExerciseFilters()
  sessions/
    View/
    types/
    repositories/    # ex: getSessionsByUser(userId)
  profile/
    View/
    types/
    services/
    repositories/    # ex: getProfile(userId)

components/
  nav/
  ui/

lib/
  supabase/
  prisma.ts
  exercises.json
```

## Base de données et environnement

Variables attendues:

- `DATABASE_URL` (pooler Supabase / pgbouncer)
- `DIRECT_URL` (connexion directe migrations)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Bonnes pratiques de contribution

- Faire des changements ciblés, cohérents avec l'architecture existante.
- Éviter de mélanger refactor et feature dans la même modification.
- Ne pas déplacer la logique métier dans `app/`.
- Préserver les IDs et schémas de données existants.
- Vérifier rapidement build/lint/typecheck si le scope touche du TypeScript.

## Quand modifier ce fichier

Mettre à jour ce document quand:
- l'architecture évolue (nouveaux dossiers/conventions),
- la stack change,
- les règles d'organisation ou de contribution changent.
