"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export const CatalogFilterPanel = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <aside className="w-full shrink-0 lg:w-52">
      {/* Botón toggle — solo visible en mobile */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 lg:hidden"
      >
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          Filtros
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Wrapper de altura — grid-rows trick para animar height: auto */}
      <div
        className={`grid transition-all duration-300 ease-out lg:grid-rows-[1fr] lg:opacity-100 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </aside>
  );
};
