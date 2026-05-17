# SME Website Builder — Phase 3 Task List

## Phase 3 — Développement du site + génération de contenu

### 3.1 Implémentation du workflow de prospection
- [ ] Développer le module de collecte/qualification des prospects
  - source de données de PME françaises
  - filtre par secteur, localisation et activité
  - score de priorité selon l'absence ou l'obsolescence du site
- [ ] Implémenter l'analyse du statut web prospect
  - détecter URL existante
  - vérifier responsive / existence / qualité du contenu
  - classer en : absent / obsolète / faible présence
- [ ] Stocker les prospects qualifiés dans un format exploitable
  - JSON/CSV avec champs : nom, secteur, localisation, statut web, URL, description

### 3.2 Génération du site prospect
- [ ] Construire les templates de pages responsives
  - page d'accueil
  - page services / prestations
  - page À propos
  - page contact
- [ ] Implémenter la génération de contenu personnalisé
  - texte d’introduction adapté au secteur
  - description des services en bénéfices clients
  - à propos de l’entreprise avec valeur ajoutée
  - section contact claire et engageante
- [ ] Appliquer la direction visuelle définie en Phase 2
  - palette de couleurs, typographie, boutons, cartes services
  - structure mobile-first et desktop

### 3.3 Génération visuelle et captures d'écran
- [ ] Intégrer un moteur de rendu pour les pages générées
  - Puppeteer ou Playwright pour captures desktop / mobile
- [ ] Générer les screens du site prospect
  - screenshot desktop
  - screenshot mobile
- [ ] Vérifier visuellement les rendus et détecter les anomalies
  - image manquante
  - mise en page cassée
  - mauvais contraste ou texte tronqué

### 3.4 Préparation de l'email commercial
- [ ] Générer le contenu du mail d’approche
  - accroche personnalisée vers la PME
  - bénéfices du nouveau site et proposition d’abonnement
  - CTA clair vers une démo ou une proposition
- [ ] Inclure les captures d'écran du site généré
- [ ] Préparer un template de mail réutilisable
  - objet, corps, structure et signature

### 3.5 Validation technique
- [ ] Vérifier les pages générées en mobile-first
- [ ] Vérifier l’accessibilité basique : structure sémantique, contraste
- [ ] Vérifier la cohérence du contenu généré avec le secteur
- [ ] Documenter les résultats de la validation

## Livrables Phase 3
- site prospect généré complet
- captures d’écran desktop et mobile
- prospect data list qualifiée
- email commercial prêt à envoyer
- rapport QA de validation du rendu
