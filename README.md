# Fakti

> La facturation simple pour les PME de la zone FCFA. Des factures propres, des clients fidèles.

Fakti est un outil de facturation pensé pour les commerces et PME d'Afrique de l'Ouest :
devis, factures en FCFA, suivi des impayés et relances — sans Excel, sans erreurs, sans stress.

**Démo interactive** : les données affichées sont fictives (boutique de Niamey), l'application est entièrement testable sans compte.

## Fonctionnalités (démo v0.1)

- **Landing commerciale** — proposition de valeur, atouts, tarifs en FCFA
- **Tableau de bord** — encaissements, CA du mois, impayés, retards, graphique sur 6 mois
- **Clients** — fiches complètes (téléphone, ville, identifiant fiscal), recherche, création, modification
- **Factures** — numérotation continue, TVA 19 % calculée automatiquement, filtres par statut, aperçu du document client, marquage « payée », relance des retards

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) + shadcn/ui
- Chiffres tabulaires FCFA · design ivoire / émeraude / ambre · mobile-first

## Démarrage local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Déploiement

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/funsoftwareafrica/fakti)

Aucune variable d'environnement requise pour la démo.

## Feuille de route

| Phase | Contenu |
|-------|---------|
| S1 | Authentification, base de données (Prisma + Neon), module Clients persistant |
| S2 | Catalogue produits, devis avec conversion en facture |
| S3 | Génération PDF, paiements + relances manuelles, paramètres |
| S4 | Partage WhatsApp, exports comptables, zone anglophone |

---

Projet portfolio de [funsoftwareafrica](https://github.com/funsoftwareafrica) — agence **Latiforge**.
