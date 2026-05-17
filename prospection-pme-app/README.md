# Prospection PME App

Prototype d'application de prospection PME pour identifier les entreprises sans site ou avec un site obsolète, générer des visuels de site et proposer une offre commerciale.

## Installation

```bash
cd prospection-pme-app
npm install
npm run dev
```

## Fonctionnalités initiales

- Recherche de PME ciblées
- Chargement de données à partir d'un fichier CSV de prospection
- Intégration optionnelle d'un annuaire public de PME via API
- Génération de visuels préliminaires de nouveau site
- Génération d'une offre commerciale personnalisée

## Notes

Ce prototype charge désormais une source de PME externe simulée via `data/companies.csv`. Il supporte aussi l'utilisation d'un annuaire public externe configuré par les variables d'environnement dans `.env.local`.

### Configuration d'une API d'annuaire public

Copiez `.env.local.example` vers `.env.local` et définissez :

```bash
PME_DIRECTORY_API_URL=https://api.annuaire-pme.example/search
PME_DIRECTORY_API_KEY=your_api_key_here
```

La recherche utilisera ensuite l'annuaire public pour enrichir les résultats de prospection.
