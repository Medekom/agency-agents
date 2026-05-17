import { NextResponse } from "next/server";
import { companies } from "../../../lib/companies";
import { generateSiteContent, generateCommercialProposal } from "../../../lib/content";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const companyId = url.searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }

  const company = companies.find((item) => item.id === companyId);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({
    siteContent: generateSiteContent(company),
    proposal: generateCommercialProposal(company)
  });
}
