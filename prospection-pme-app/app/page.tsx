"use client";

import { useState } from "react";
import { Company } from "../lib/companies";
import CompanyCard from "../components/CompanyCard";
import OfferCard from "../components/OfferCard";
import VisualPreviewCard from "../components/VisualPreviewCard";

type VisualPreview = {
  companyId: string;
  heroTitle: string;
  heroSubtitle: string;
  keyPoints: string[];
  sections: Array<{ title: string; description: string }>;
};

type Offer = {
  companyId: string;
  summary: string;
  price: string;
  benefits: string[];
  timeline: string;
  callToAction: string;
};

type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  businessHighlights: string[];
  serviceBlocks: Array<{ title: string; description: string }>;
  testimonialSnippet: string;
  callToAction: string;
};

type ProposalDetails = {
  companyId: string;
  intro: string;
  deliverables: string[];
  pricing: string;
  warranty: string;
  nextStep: string;
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [visual, setVisual] = useState<VisualPreview | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [proposal, setProposal] = useState<ProposalDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    setVisual(null);
    setOffer(null);
    setSiteContent(null);
    setProposal(null);
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const items = (await response.json()) as Company[];
    setResults(items);
    setLoading(false);
  };

  const createVisual = async (companyId: string) => {
    const response = await fetch(`/api/visuals?companyId=${encodeURIComponent(companyId)}`);
    const payload = (await response.json()) as VisualPreview;
    setVisual(payload);
    setOffer(null);
    setSiteContent(null);
    setProposal(null);
  };

  const createOffer = async (companyId: string) => {
    const response = await fetch(`/api/offer?companyId=${encodeURIComponent(companyId)}`);
    const payload = (await response.json()) as Offer;
    setOffer(payload);
    setVisual(null);
    setSiteContent(null);
    setProposal(null);
  };

  const createEnrichedProposal = async (companyId: string) => {
    const response = await fetch(`/api/enrich?companyId=${encodeURIComponent(companyId)}`);
    const payload = await response.json();
    setSiteContent(payload.siteContent as SiteContent);
    setProposal(payload.proposal as ProposalDetails);
    setVisual(null);
    setOffer(null);
  };

  return (
    <main className="container">
      <div className="card">
        <h1 className="section-title">Prospection PME</h1>
        <p>Rechercher des entreprises sans site ou avec un site obsolète. Générer une proposition commerciale et un aperçu de site personnalisé.</p>

        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <input
            className="input"
            placeholder="Rechercher une industrie, une ville ou une PME"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="button" onClick={search} disabled={loading}>
            {loading ? "Recherche..." : "Lancer la recherche"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 className="section-title">Résultats</h2>
        {results.length === 0 ? (
          <p>Aucune entreprise sélectionnée. Lancez une recherche pour afficher des PME cibles.</p>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            {results.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onCreateVisual={() => createVisual(company.id)}
                onCreateOffer={() => createOffer(company.id)}
                onCreateEnriched={() => createEnrichedProposal(company.id)}
              />
            ))}
          </div>
        )}
      </div>

      {visual && (
        <div style={{ marginTop: 24 }}>
          <h2 className="section-title">Aperçu du site généré</h2>
          <VisualPreviewCard visual={visual} />
        </div>
      )}

      {offer && (
        <div style={{ marginTop: 24 }}>
          <h2 className="section-title">Offre commerciale</h2>
          <OfferCard offer={offer} />
        </div>
      )}

      {siteContent && (
        <div style={{ marginTop: 24 }}>
          <div className="card">
            <h2 className="section-title">Contenu de site enrichi</h2>
            <h3>{siteContent.heroTitle}</h3>
            <p>{siteContent.heroSubtitle}</p>
            <h4>Points forts</h4>
            <ul>
              {siteContent.businessHighlights.map((item) => (
                <li key={item} className="list-item">{item}</li>
              ))}
            </ul>
            {siteContent.serviceBlocks.map((block) => (
              <div key={block.title} style={{ marginTop: 12 }}>
                <h5>{block.title}</h5>
                <p>{block.description}</p>
              </div>
            ))}
            <p style={{ marginTop: 16, fontStyle: "italic" }}>{siteContent.testimonialSnippet}</p>
            <p>{siteContent.callToAction}</p>
          </div>
        </div>
      )}

      {proposal && (
        <div style={{ marginTop: 24 }}>
          <div className="card">
            <h2 className="section-title">Proposition commerciale détaillée</h2>
            <p>{proposal.intro}</p>
            <h4>Livrables</h4>
            <ul>
              {proposal.deliverables.map((item) => (
                <li key={item} className="list-item">{item}</li>
              ))}
            </ul>
            <p>
              <strong>Prix:</strong> {proposal.pricing}
            </p>
            <p>
              <strong>Garantie:</strong> {proposal.warranty}
            </p>
            <p>{proposal.nextStep}</p>
          </div>
        </div>
      )}
    </main>
  );
}
