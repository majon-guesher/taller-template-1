import type { Metadata } from "next";
import { Archivo, Anton } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "Pantano Tóxico",
  description: "Tocá la pantalla. Sacale la basura al pantano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`h-full antialiased ${archivo.variable} ${anton.variable}`}
    >
      <body className="min-h-full flex flex-col bg-[#05080a]">{children}</body>
    </html>
  );
}
