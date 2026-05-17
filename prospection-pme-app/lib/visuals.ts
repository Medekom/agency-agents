import { Company } from "./companies";

export type VisualPreview = {
  companyId: string;
  heroTitle: string;
  heroSubtitle: string;
  keyPoints: string[];
  sections: Array<{ title: string; description: string }>;
};

export const generateVisualPreview = (company: Company): VisualPreview => {
  return {
    companyId: company.id,
    heroTitle: `${company.name} - une présence digitale à la hauteur de vos compétences`,
    heroSubtitle: `Nouveau site web clair, mobile-first et orienté conversion pour ${company.industry.toLowerCase()} à ${company.city}.`,
    keyPoints: [
      "Homepage impactante avec preuve sociale",
      "Pages service structurées pour les offres clés",
      "Contact rapide et rendez-vous en ligne",
      "Visuels professionnels avec vos cas clients"
    ],
    sections: [
      {
        title: "Nos services",
        description: "Présentation rapide de chaque service, accompagnée d'icônes et de phrases actionnables pour faciliter le choix du client."
      },
      {
        title: "Réalisations",
        description: "Galerie de projets avec descriptions métier pour montrer votre savoir-faire à des prospects locaux."
      },
      {
        title: "Pourquoi nous choisir ?",
        description: "Argumentaire basé sur la qualité artisanale, le service local et la rapidité de réalisation."
      }
    ]
  };
};
