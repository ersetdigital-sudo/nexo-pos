import type { Metadata } from "next";
import "./globals.css";
import StoreInitializer from "@/components/StoreInitializer";

export const metadata: Metadata = {
  title: "Dapur Bunda POS - Aplikasi Kasir Modern",
  description: "Aplikasi kasir digital modern dengan fitur lengkap untuk mendukung bisnis Anda",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="bg-surface-200">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="theme-color" content="#F8F9FB" />
      </head>
      <body className="min-h-screen">
        <StoreInitializer>
          {children}
        </StoreInitializer>
      </body>
    </html>
  );
}
