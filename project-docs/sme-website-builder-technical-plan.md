# SME Website Builder — Plan technique de génération de site

## Objectif
Définir l’architecture technique et la stack pour générer automatiquement des sites web modernes et produire un package commercial prospect.

## Architecture globale
1. Entrée prospect
   - Recherche et qualification des PME
   - Analyse de présence web existante
2. Pipeline de génération
   - Génération de contenu textuel contextualisé
   - Génération de structure de site et pages
   - Application du design visuel
3. Validation et production
   - Capture d'écran desktop/mobile
   - Assemblage du package commercial
4. Distribution
   - Préparation d’un email d’offre avec screenshots

## Choix technologiques recommandés
- Frontend / site généré : Next.js (React) avec CSS Modules ou Tailwind CSS
- Backend / API : Node.js + Express ou Next.js API routes
- Contenu : templates Markdown/JSON dynamiques
- Screenshot : Puppeteer ou Playwright pour rendu des pages
- Email : service SMTP / API Mailgun ou Sendinblue

## Composants principaux
### 1. Analyseur de prospects
- Script de collecte de données publiques sur les PME françaises
- Détection du site existant via URL
- Règles de scoring : absence de site, site obsolète, mobile non supporté

### 2. Générateur de contenu
- Module de génération de texte basé sur le secteur et l’activité
- Produits : page d’accueil, page services, page À propos, page contact
- Structure templated pour adaptation rapide

### 3. Générateur de site
- Template de page responsive
- Composants réutilisables : Hero, Cards services, Section témoignage, CTA
- Fichiers HTML/CSS/JS exportés ou rendu statique via Next.js

### 4. Validation visuelle
- Utiliser Puppeteer/Playwright pour capturer desktop et mobile
- Vérifier les résultats visuels et détecter les erreurs de rendu

### 5. Assemblage d’email commercial
- Incorporer éléments : proposition, bénéfices, prix, CTA
- Attacher ou lier aux screenshots du site généré

## Flux de données
- prospect.json → content-generation → site-template → site-output
- site-output + screenshots → outbound-email

## Sécurité et qualité
- Validation des données entrantes de prospect
- Séparation des responsabilités entre analyse prospect et génération de site
- Contrôle des performances : pages légères, images optimisées
- Tests de base : rendu mobile, accessibilité simple, liens contact

## Étapes de mise en œuvre
1. Construire le moteur de qualification prospect
2. Développer le template de site responsive
3. Implémenter la génération de contenu par secteur
4. Intégrer le rendu screenshot automatisé
5. Construire le module email avec pièce jointe ou lien

## Résultat attendu
- Une application capable de générer un site démo prêt à présenter à un prospect
- Une représentation claire du workflow technique
- Une base extensible pour passer ensuite à la phase 3 d’implémentation complète
