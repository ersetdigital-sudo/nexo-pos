"use client";

import { useStore } from "@/store";

export default function Header({ title }: { title: string }) {
  const { storeName } = useStore();

  return (
    <header className="h-14 bg-white border-b-2 border-text flex items-center justify-between px-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-500">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <div className="badge-brutal bg-success text-white">
          Online
        </div>
      </div>
    </header>
  );
}
