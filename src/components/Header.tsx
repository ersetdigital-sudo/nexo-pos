"use client";

import { IconBell, IconWifi, IconDashboard } from "./Icons";

export default function Header({ title, onMenuToggle }: { title: string; onMenuToggle?: () => void }) {
  return (
    <header className="h-14 md:h-16 bg-white/80 backdrop-blur-sm border-b border-primary-100/60 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-primary-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-base md:text-lg font-semibold text-text truncate">{title}</h2>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-sm text-text-muted hidden md:block">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <button className="relative p-2 rounded-lg hover:bg-primary-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
          <IconBell className="w-5 h-5 text-text-muted" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
        </button>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-green-50 border border-green-100">
          <IconWifi className="w-3.5 h-3.5 text-success" />
          <span className="text-xs font-medium text-success">Online</span>
        </div>
      </div>
    </header>
  );
}
