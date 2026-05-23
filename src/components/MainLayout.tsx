"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
