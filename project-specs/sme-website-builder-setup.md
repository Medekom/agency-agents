# Projet : SME Website Builder

## Objectif
Créer une application autonome qui identifie des PME françaises ayant un bon chiffre d'affaires et peu ou pas de présence web, puis propose un site internet moderne, personnalisé et une offre d'abonnement via un email commercial avec captures d'écran.

## Cible
- PME françaises
- Secteurs B2B et services locaux
- Chiffre d'affaires significatif (> 500k€ par an, ou seuil précisé par l'utilisateur)
- Pas de site web, ou site ancien / obsolète / non responsive / sans contenu à jour

## Résultats attendus
1. Liste d'entreprises identifiées avec leur nom, secteur, localisation, et description
2. Détection du statut web : absent, obsolète, ou peu performant
3. Génération d'un site web moderne pour chaque prospect, incluant :
   - page d'accueil
   - page services / prestations
   - page « À propos » de l'entreprise
   - page contact
   - contenus texte réels basés sur l'entreprise et son activité
   - visuel réaliste (maquettes ou images libres de droits)
4. Capture d'écran du site généré (desktop et mobile)
5. Email commercial prêt à l'envoi avec proposition d'abonnement pour le site complet

## Fonctionnalités principales
- Prospection automatique de PME en France
- Analyse de la présence web existante
- Création de site web responsive moderne
- Génération de contenu d'entreprise réel et contextualisé
- Préparation d'une offre commerciale par email
- Mise en forme du package de vente : screenshots + proposition d'abonnement

## Contraintes
- Le site doit être responsive mobile + desktop
- Le contenu doit être crédible, adapté à l'entreprise et non générique
- Le design doit être moderne, professionnel et cohérent avec le secteur
- L'email commercial doit inclure : objectif, valeur, prix d'abonnement, CTA clair
- L'application doit être pensée comme un workflow automatisé piloté par l'`Agents Orchestrator`

## Critères de réussite
- Identification d'au moins 10 PME pertinentes sans site ou avec site obsolète
- Génération d'au moins un site de démonstration complet et fonctionnel
- Production de captures d'écran valides pour démonstration
- Création d'un email commercial prêt à être envoyé
- Documentation des phases et des résultats de la pipeline

## Livrables
- Spécification technique du projet
- Liste des prospects ciblés
- Site web généré (maquette statique / prototype HTML/CSS/JS)
- Dossier de contenus réels pour l'entreprise
- Screenshots du site généré
- Template d'email commercial
- Rapport de validation QA

## Pipeline recommandée
- Phase 1 : Analyse du besoin et définition des tâches
- Phase 2 : Architecture technique et design UX
- Phase 3 : Développement du site + génération de contenu
- Phase 4 : QA / validation des livrables
- Phase 5 : Livraison email + proposition d'abonnement

## Petites notes pour l'orchestrateur
- Utiliser `project-manager-senior` pour extraire une tâche claire
- Utiliser `UX Architect` et `Brand Guardian` pour cadrer le design
- Utiliser `Frontend Developer` et `Backend Architect` pour implémenter
- Utiliser `Evidence Collector` pour vérifier les captures et la conformité
- Utiliser `Reality Checker` pour la validation finale
