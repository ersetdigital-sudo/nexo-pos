"use client";

import { IconBell, IconWifi } from "./Icons";

export default function Header({ title }: { title: string }) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-dark-100 flex items-center justify-between px-6 sticky top-0 z-20">
      <h2 className="text-lg font-bold text-dark-800">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-dark-400">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <button className="relative p-2 rounded-xl hover:bg-dark-50 transition-colors">
          <IconBell className="w-5 h-5 text-dark-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50">
          <IconWifi className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">Online</span>
        </div>
      </div>
    </header>
  );
}
