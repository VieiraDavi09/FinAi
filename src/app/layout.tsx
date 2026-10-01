import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/providers";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: "FinAI - Seu Copiloto Financeiro Inteligente",
  description: "Gerencie despesas, acompanhe metas no Cofrinho IA, previna desperdícios e projete seu futuro financeiro.",
  keywords: ["finanças", "copiloto financeiro", "finanças universitários", "controle freelancer", "organizar contas", "inteligência artificial finanças"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full antialiased text-foreground">
        <AppProviders>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AppProviders>
      </body>
    </html>
  );
}
