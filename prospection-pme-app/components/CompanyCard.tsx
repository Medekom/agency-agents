import { Company } from "../lib/companies";

type Props = {
  company: Company;
  onCreateVisual: () => void;
  onCreateOffer: () => void;
  onCreateEnriched: () => void;
};

export default function CompanyCard({ company, onCreateVisual, onCreateOffer, onCreateEnriched }: Props) {
  return (
    <div className="card">
      <h3>{company.name}</h3>
      <p>{company.description}</p>
      <p>
        <strong>Ville:</strong> {company.city}
      </p>
      <p>
        <strong>Secteur:</strong> {company.industry}
      </p>
      <p>
        <strong>Equipe:</strong> {company.employeeCount} salariés
      </p>
      <p className="badge">{company.website ? `Site obsolète (${company.siteAgeYears ?? "?"} ans)` : "Pas de site"}</p>
      <h4>Problèmes</h4>
      <ul>
        {company.painPoints.map((point) => (
          <li key={point} className="list-item">{point}</li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
        <button className="button" onClick={onCreateVisual}>
          Générer visuel
        </button>
        <button className="button" style={{ background: "#047857" }} onClick={onCreateOffer}>
          Générer offre
        </button>
        <button className="button" style={{ background: "#c026d3" }} onClick={onCreateEnriched}>
          Proposition complète
        </button>
      </div>
    </div>
  );
}
