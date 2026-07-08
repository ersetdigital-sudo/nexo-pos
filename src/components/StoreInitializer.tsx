"use client";

import { useEffect } from "react";
import { useStore } from "@/store";

export default function StoreInitializer({ children }: { children: React.ReactNode }) {
  const { initializeStore, isLoading, isInitialized } = useStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (isLoading && !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
