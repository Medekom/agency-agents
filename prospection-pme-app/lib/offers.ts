import { Company } from "./companies";

export type Offer = {
  companyId: string;
  summary: string;
  price: string;
  benefits: string[];
  timeline: string;
  callToAction: string;
};

export const generateOffer = (company: Company): Offer => {
  const priceTier = company.employeeCount <= 10 ? "4 900 €" : "7 900 €";
  return {
    companyId: company.id,
    summary: `Création d'un site vitrine moderne pour ${company.name}, conçu pour convertir plus de demandes de contact et améliorer la visibilité locale dans ${company.city}.`,
    price: priceTier,
    benefits: [
      "Design responsive optimisé mobile",
      "Contenu métier adapté à votre clientèle locale",
      "Page de services claire et démonstrative",
      "Formulaire de contact rapide et prise de rendez-vous"
    ],
    timeline: "Livraison en 3 à 4 semaines avec deux cycles de validation.",
    callToAction: "Contactez-nous pour valider la proposition et lancer la refonte de votre site."
  };
};
