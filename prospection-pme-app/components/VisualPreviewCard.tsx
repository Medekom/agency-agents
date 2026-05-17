type VisualPreview = {
  heroTitle: string;
  heroSubtitle: string;
  keyPoints: string[];
  sections: Array<{ title: string; description: string }>;
};

type Props = {
  visual: VisualPreview;
};

export default function VisualPreviewCard({ visual }: Props) {
  return (
    <div className="card">
      <h3>{visual.heroTitle}</h3>
      <p>{visual.heroSubtitle}</p>
      <h4>Points forts</h4>
      <ul>
        {visual.keyPoints.map((point) => (
          <li key={point} className="list-item">{point}</li>
        ))}
      </ul>
      <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
        {visual.sections.map((section) => (
          <div key={section.title} style={{ padding: 16, background: "#f8fafc", borderRadius: 16 }}>
            <h5>{section.title}</h5>
            <p>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
