import { Company } from "./companies";

const normalizeString = (value: unknown): string => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

const mapExternalToCompany = (entry: any): Company => {
  const generatedId = [entry.id, entry.siren, entry.siret, entry.name].find(Boolean) ?? Math.random().toString(36).slice(2, 10);

  return {
    id: normalizeString(generatedId),
    name: normalizeString(entry.name ?? entry.companyName ?? entry.entreprise ?? "Entreprise PME"),
    industry: normalizeString(entry.industry ?? entry.activity ?? entry.sector ?? entry.field ?? "Activité non précisée"),
    website: normalizeString(entry.website ?? entry.site ?? entry.url) || undefined,
    siteAgeYears: entry.siteAgeYears ? Number(entry.siteAgeYears) : entry.websiteAge ? Number(entry.websiteAge) : undefined,
    description: normalizeString(entry.description ?? entry.summary ?? entry.presentation ?? ""),
    city: normalizeString(entry.city ?? entry.town ?? entry.location ?? entry.ville ?? ""),
    employeeCount: entry.employeeCount ? Number(entry.employeeCount) : entry.teamSize ? Number(entry.teamSize) : 0,
    painPoints: Array.isArray(entry.painPoints)
      ? entry.painPoints.map(normalizeString).filter(Boolean)
      : [],
  };
};

const getDirectoryUrl = (): string | undefined => {
  return process.env.PME_DIRECTORY_API_URL?.trim() || undefined;
};

const getDirectoryKey = (): string | undefined => {
  return process.env.PME_DIRECTORY_API_KEY?.trim() || undefined;
};

export const fetchPublicDirectoryCompanies = async (query: string): Promise<Company[]> => {
  const directoryUrl = getDirectoryUrl();
  if (!directoryUrl) {
    return [];
  }

  const url = new URL(directoryUrl);
  if (query.length > 0) {
    url.searchParams.set("q", query);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  const apiKey = getDirectoryKey();
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  try {
    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      console.warn("Public directory API returned error", response.status, response.statusText);
      return [];
    }

    const json = await response.json();
    const items = json.items ?? json.data ?? json.companies ?? json.results ?? [];
    if (!Array.isArray(items)) {
      return [];
    }

    const companies = items.map(mapExternalToCompany).filter((company) => company.name && company.city);
    return companies;
  } catch (error) {
    console.error("Failed to fetch public directory companies:", error);
    return [];
  }
};
