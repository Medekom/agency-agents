import fs from "fs";
import path from "path";
import { Company } from "./companies";

export type CompanySourceEntry = Company & {
  source: string;
  lastIndexed: string;
};

const csvFilePath = path.join(process.cwd(), "data", "companies.csv");

const parseCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
};

const parseCsv = (csv: string): Record<string, string>[] => {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ?? "";
    });
    return record;
  });
};

const loadCompanySource = (): CompanySourceEntry[] => {
  try {
    const raw = fs.readFileSync(csvFilePath, "utf-8");
    const rows = parseCsv(raw);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      industry: row.industry,
      website: row.website || undefined,
      siteAgeYears: row.siteAgeYears ? Number(row.siteAgeYears) : undefined,
      description: row.description,
      city: row.city,
      employeeCount: row.employeeCount ? Number(row.employeeCount) : 0,
      painPoints: row.painPoints ? row.painPoints.split("|").map((item) => item.trim()).filter(Boolean) : [],
      source: row.source || "CSV externe",
      lastIndexed: row.lastIndexed || ""
    }));
  } catch (error) {
    console.error("Unable to load company source CSV:", error);
    return [];
  }
};

const companySource = loadCompanySource();

export const discoverCompanies = (query: string): CompanySourceEntry[] => {
  const normalized = query.trim().toLowerCase();
  return companySource.filter((company) => {
    const text = [company.name, company.industry, company.description, company.city, company.source]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesQuery = normalized.length === 0 || text.includes(normalized);
    const needsWebsite = !company.website || (company.siteAgeYears ?? 0) >= 5;
    return matchesQuery && needsWebsite;
  });
};
