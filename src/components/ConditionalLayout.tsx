'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

// Rotas que não devem exibir a Sidebar (telas standalone / landing page)
const STANDALONE_ROUTES = ['/login', '/assinar', '/precos'];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fecha o drawer mobile ao mudar de página
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isStandalone = pathname === '/' || STANDALONE_ROUTES.some((route) => pathname.startsWith(route));

  if (isStandalone && pathname !== '/dashboard') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#02040a]">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar - Desktop Fixa & Mobile Drawer */}
      <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 md:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <Sidebar onCloseMobile={() => setMobileOpen(false)} />
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Mobile Header Bar */}
        <div className="md:hidden h-14 border-b border-border/40 bg-[#070913]/90 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden bg-gradient-to-tr from-emerald-500 to-violet-500 p-0.5">
              <Image src="/img/logo.png" alt="finAI" width={24} height={24} className="w-full h-full object-contain bg-[#070913] rounded" />
            </div>
            <span className="font-bold text-white text-base">
              fin<span className="text-emerald-400">AI</span>
            </span>
          </div>

          <div className="w-8" />
        </div>

        {children}
      </main>
    </div>
  );
}
