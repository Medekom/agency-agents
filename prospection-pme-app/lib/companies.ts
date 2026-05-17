export type Company = {
  id: string;
  name: string;
  industry: string;
  website?: string;
  siteAgeYears?: number;
  description: string;
  city: string;
  employeeCount: number;
  painPoints: string[];
};

export const companies: Company[] = [
  {
    id: "c1",
    name: "Atelier Verdoyant",
    industry: "Paysagisme",
    website: undefined,
    description: "Entreprise locale de paysagisme qui accompagne les particuliers et les collectivités sur la création et l'entretien de jardins.",
    city: "Lyon",
    employeeCount: 12,
    painPoints: [
      "Aucune visibilité en ligne",
      "Difficulté à montrer des réalisations",
      "Peu de demandes de devis entrantes"
    ]
  },
  {
    id: "c2",
    name: "Menuiserie Chartron",
    industry: "Menuiserie",
    website: "https://menuiserie-chartron.fr",
    siteAgeYears: 8,
    description: "Menuiserie artisanale spécialisée dans les agencements sur mesure, les ouvertures et la rénovation intérieure.",
    city: "Nantes",
    employeeCount: 10,
    painPoints: [
      "Site obsolète et difficile à parcourir",
      "Aucune présence sur mobile",
      "Taux de conversion faible"
    ]
  },
  {
    id: "c3",
    name: "Sécurité BTP 44",
    industry: "Sécurité chantier",
    website: "https://securite-btp44.com",
    siteAgeYears: 6,
    description: "Société de prévention et formation sécurité pour les chantiers du bâtiment et des travaux publics.",
    city: "Saint-Nazaire",
    employeeCount: 18,
    painPoints: [
      "Message peu clair sur l'offre",
      "Aucun formulaire de contact optimisé",
      "Pas de preuves sociales visibles"
    ]
  }
];

export const searchCompanies = (query: string): Company[] => {
  const normalized = query.trim().toLowerCase();
  return companies.filter((company) => {
    const text = [company.name, company.industry, company.description, company.city]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesQuery = normalized.length === 0 || text.includes(normalized);
    const needsWebsite = !company.website || (company.siteAgeYears ?? 0) >= 5;

    return matchesQuery && needsWebsite;
  });
};
