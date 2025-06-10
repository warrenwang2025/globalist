import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { CustomSonner } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Globalist Media Suite",
  description:
    "Globalist Media Suite is a modular content platform for creators, publishers, and media teams to manage AI-driven creation, SEO, publishing, and syndication.",
  icons: "/apple-touch-icon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link
          rel="icon"
          href="/icon-192.png"
          sizes="192x192"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <CustomSonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
