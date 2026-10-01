'use strict';
'use client';

import React from 'react';
import { useApp } from '@/providers';
import { Sparkles, RefreshCw, GraduationCap, Briefcase, User2 } from 'lucide-react';
import { ProfileType } from '@/lib/db';

export default function Header({ title }: { title?: string }) {
  const { profile, setProfileType, togglePremium, resetAllData } = useApp();

  return (
    <header className="h-16 border-b border-border/40 bg-[#02040a]/40 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Title */}
      <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
        {title || 'FinAI Copiloto'}
      </h1>

      {/* Simulator Control Panel */}
      <div className="flex items-center gap-4">
        {/* Switch Profile Type */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setProfileType('student')}
            className={`btn-interactive-ghost p-1.5 rounded-md flex items-center gap-1 text-xs ${
              profile.profileType === 'student'
                ? 'bg-emerald-500 text-black font-semibold'
                : 'text-muted-foreground hover:text-white'
            }`}
            title="Mudar para perfil de Estudante"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Estudante</span>
          </button>
          <button
            onClick={() => setProfileType('freelancer')}
            className={`btn-interactive-ghost p-1.5 rounded-md flex items-center gap-1 text-xs ${
              profile.profileType === 'freelancer'
                ? 'bg-emerald-500 text-black font-semibold'
                : 'text-muted-foreground hover:text-white'
            }`}
            title="Mudar para perfil de Freelancer/Autônomo"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Freelancer</span>
          </button>
          <button
            onClick={() => setProfileType('standard')}
            className={`btn-interactive-ghost p-1.5 rounded-md flex items-center gap-1 text-xs ${
              profile.profileType === 'standard'
                ? 'bg-emerald-500 text-black font-semibold'
                : 'text-muted-foreground hover:text-white'
            }`}
            title="Mudar para perfil Geral"
          >
            <User2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Padrão</span>
          </button>
        </div>

        {/* Toggle Premium Simulation */}
        <button
          onClick={togglePremium}
          className={`btn-interactive-ghost flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            profile.isPremium
              ? 'bg-violet-600/20 border-violet-500 text-violet-300'
              : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'
          }`}
          title="Simular assinatura Premium"
        >
          <Sparkles className={`w-3.5 h-3.5 ${profile.isPremium ? 'text-violet-400 fill-violet-400' : ''}`} />
          <span>{profile.isPremium ? 'Premium Ativo' : 'Simular Premium'}</span>
        </button>

        {/* Reset Database Seed */}
        <button
          onClick={() => {
            if (confirm('Deseja redefinir os dados simulados para as configurações originais deste perfil?')) {
              resetAllData();
            }
          }}
          className="btn-interactive-ghost p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-white"
          title="Redefinir banco de dados simulado"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
