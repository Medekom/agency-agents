import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prospection PME",
  description: "Prototype de recherche de PME, visualisation de site et offre commerciale."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
