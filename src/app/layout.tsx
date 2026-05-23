import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexo POS - Aplikasi Kasir Modern",
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
    <html lang="id">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="theme-color" content="#FFF5E6" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
