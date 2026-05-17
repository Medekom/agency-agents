import { NextResponse } from "next/server";
import { companies } from "../../../lib/companies";
import { generateVisualPreview } from "../../../lib/visuals";

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

  const preview = generateVisualPreview(company);
  return NextResponse.json(preview);
}
