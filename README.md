# FitForYou

Application web de suivi de séances de gym — créez vos workouts, parcourez une bibliothèque d'exercices, et suivez votre progression dans le temps.

## Fonctionnalités

- **Tableau de bord** — vue d'ensemble des sessions récentes, exercices favoris, calendrier d'activité et compteur de séries
- **Bibliothèque d'exercices** — 500+ exercices filtrables par groupe musculaire, équipement et difficulté, avec favoris
- **Gestion des séances** — créez, éditez, dupliquez et supprimez vos workouts avec le détail des exercices, séries, répétitions et charges
- **Suivi du poids** — enregistrez votre poids et visualisez votre progression avec un graphique historique + calcul IMC
- **Profil** — personnalisez votre avatar, votre nom et vos mensurations
- **Authentification** — inscription, connexion, réinitialisation de mot de passe via Supabase Auth

## Stack technique

| Couche | Technologies |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5 |
| Style | Tailwind CSS v4, shadcn/ui, Lucide React |
| Backend | Supabase (PostgreSQL + Auth), Prisma 7 |
| Formulaires | TanStack React Form, Zod |
| Visualisation | Recharts |
| Divers | DND Kit, Sonner, next-themes, date-fns |

## Démarrage

### Prérequis

- Node.js 20+
- pnpm
- Un projet [Supabase](https://supabase.com)

### Installation

```bash
git clone https://github.com/<your-username>/fitforyou.git
cd fitforyou
pnpm install
```

### Variables d'environnement

Créez un fichier `.env` à la racine :

```env
# Connexion poolée (runtime)
DATABASE_URL="postgresql://[user]:[password]@[host]:6543/postgres?pgbouncer=true"

# Connexion directe (migrations Prisma)
DIRECT_URL="postgresql://[user]:[password]@[host]:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# URL de l'application (redirections auth)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Base de données

```bash
# Appliquer le schéma Prisma
pnpm prisma migrate dev

# Peupler les exercices
pnpm prisma db seed
```

### Lancer en développement

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Architecture

Le projet suit une séparation stricte en quatre couches :

```
app/            → routes minimalistes (3-5 lignes)
screens/        → Server Components d'orchestration (fetch + composition)
features/       → domaines métier (View / services / repositories / types)
components/     → composants UI réutilisables (shadcn/ui + nav)
```

Les accès Prisma sont exclusivement dans les `repositories/`, les Server Actions dans les `services/`.
