import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ScaleProvider } from "@/hooks/use-scale";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Escala Certa - Controle de Turnos",
  description: "Gerencie sua escala 12x36 com facilidade",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Escala Certa",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <ScaleProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            <Navigation />
            <main className="flex-1 pb-20 md:pb-0 overflow-auto">
              {children}
            </main>
          </div>
        </ScaleProvider>
      </body>
    </html>
  );
}
