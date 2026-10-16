import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krushna 53 — Wedding invitations",
  description: "Create a wedding invitation your guests will remember with Krushna 53.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
