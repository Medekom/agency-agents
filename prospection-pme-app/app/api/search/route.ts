import { NextResponse } from "next/server";
import { companies, searchCompanies } from "../../../lib/companies";
import { discoverCompanies } from "../../../lib/companySource";
import { fetchPublicDirectoryCompanies } from "../../../lib/publicDirectory";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const localItems = searchCompanies(query);
  const sourcedItems = discoverCompanies(query);
  const externalItems = await fetchPublicDirectoryCompanies(query);
  const allItems = [...localItems, ...sourcedItems, ...externalItems];
  const uniqueItems = Array.from(new Map(allItems.map((company) => [company.id, company])).values());

  return NextResponse.json(uniqueItems);
}
