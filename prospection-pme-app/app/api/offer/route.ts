import { NextResponse } from "next/server";
import { companies } from "../../../lib/companies";
import { generateOffer } from "../../../lib/offers";

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

  const offer = generateOffer(company);
  return NextResponse.json(offer);
}
