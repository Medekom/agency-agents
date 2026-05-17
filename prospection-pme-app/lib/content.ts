import { Company } from "./companies";

export type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  businessHighlights: string[];
  serviceBlocks: Array<{ title: string; description: string }>;
  testimonialSnippet: string;
  callToAction: string;
};

export type ProposalDetails = {
  companyId: string;
  intro: string;
  deliverables: string[];
  pricing: string;
  warranty: string;
  nextStep: string;
};

export const generateSiteContent = (company: Company): SiteContent => {
  return {
    heroTitle: `Un site web moderne pour ${company.name}`,
    heroSubtitle: `Valorisez votre expertise en ${company.industry.toLowerCase()} à ${company.city} et attirez plus de clients locaux`,
    businessHighlights: [
      "Conception mobile-first pour une expérience fluide sur smartphone",
      "Structure SEO locale pour capter les recherches de votre zone géographique",
      "Pages service organisées pour convertir les visiteurs en leads"
    ],
    serviceBlocks: [
      {
        title: "Accompagnement personnalisé",
        description: "Nous traduisons votre savoir-faire en messages clairs et vendeurs pour vos clients locaux."
      },
      {
        title: "Présentation des réalisations",
        description: "Mise en avant de vos projets et témoignages pour renforcer la confiance des prospects."
      },
      {
        title: "Contact simplifié",
        description: "Formulaire de demande de devis rapide, positionné pour augmenter les prises de contact."
      }
    ],
    testimonialSnippet: `« ${company.name} gagne en crédibilité en ligne et attire plus de demandes de devis grâce à un site moderne et clair. »`,
    callToAction: "Validez la proposition et lancez la création de votre nouveau site dès aujourd'hui."
  };
};

export const generateCommercialProposal = (company: Company): ProposalDetails => {
  const pricing = company.employeeCount <= 10 ? "4 900 €" : "7 900 €";
  return {
    companyId: company.id,
    intro: `Proposition commerciale complète pour ${company.name}, adaptée à votre activité de ${company.industry.toLowerCase()} à ${company.city}.`,
    deliverables: [
      "Audit UX/SEO de l'existant",
      "Maquette de page d'accueil + pages clés",
      "Rédaction de contenu métier optimisé",
      "Mise en ligne et formation de l'équipe"
    ],
    pricing,
    warranty: "Garantie 30 jours de corrections post-livraison.",
    nextStep: "Planifiez un entretien commercial pour valider le plan et lancer la production."
  };
};
