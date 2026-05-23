import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexo POS - Aplikasi Kasir Modern",
  description: "Aplikasi kasir digital modern dengan fitur lengkap untuk mendukung bisnis Anda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
