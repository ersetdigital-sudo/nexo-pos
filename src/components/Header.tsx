"use client";

import { IconBell, IconWifi } from "./Icons";

export default function Header({ title }: { title: string }) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-primary-100/60 flex items-center justify-between px-6 sticky top-0 z-20">
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-muted hidden md:block">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <button className="relative p-2 rounded-lg hover:bg-primary-50 transition-colors">
          <IconBell className="w-5 h-5 text-text-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-green-50 border border-green-100">
          <IconWifi className="w-3.5 h-3.5 text-success" />
          <span className="text-xs font-medium text-success">Online</span>
        </div>
      </div>
    </header>
  );
}
