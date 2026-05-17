type Offer = {
  summary: string;
  price: string;
  benefits: string[];
  timeline: string;
  callToAction: string;
};

type Props = {
  offer: Offer;
};

export default function OfferCard({ offer }: Props) {
  return (
    <div className="card">
      <p>{offer.summary}</p>
      <p>
        <strong>Prix estimé:</strong> {offer.price}
      </p>
      <h4>Avantages</h4>
      <ul>
        {offer.benefits.map((benefit) => (
          <li key={benefit} className="list-item">{benefit}</li>
        ))}
      </ul>
      <p>
        <strong>Délais:</strong> {offer.timeline}
      </p>
      <p>{offer.callToAction}</p>
    </div>
  );
}
