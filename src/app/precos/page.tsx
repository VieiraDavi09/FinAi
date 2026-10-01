'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useApp } from '@/providers';
import {
  Check,
  X,
  Sparkles,
  HelpCircle,
  CreditCard,
  Zap
} from 'lucide-react';

export default function Precos() {
  const router = useRouter();
  const { profile, togglePremium } = useApp();

  const handleSubscribe = (planName: string) => {
    if (profile.isPremium) {
      // Already premium — just show the subscription page
      router.push('/assinar');
      return;
    }
    // Redirect to the checkout page (/assinar) which has the full checkout flow
    router.push('/assinar');
  };

  const freeFeatures = [
    { label: 'Até 100000 lançamentos por mês', available: true },
    { label: 'Até 3 metas de economia ativas', available: true },
    { label: 'Chat IA limitado (15 msgs/mês)', available: true },
    { label: 'Relatórios e gráficos básicos', available: true },
    { label: 'Sincronização bancária automática', available: false },
    { label: 'Simulador de Futuro Financeiro', available: false },
    { label: 'Previsões avançadas para autônomos', available: false },
  ];

  const premiumFeatures = [
    { label: 'Lançamentos mensais ilimitados', available: true },
    { label: 'Metas e cofrinhos ilimitados', available: true },
    { label: 'Chat IA ilimitado com RAG', available: true },
    { label: 'Sincronização bancária (Pluggy/Belvo)', available: true },
    { label: 'Simulações de Futuro Avançadas', available: true },
    { label: 'Modo Universitário & Freelancer total', available: true },
    { label: 'Detector de desperdício em tempo real', available: true },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#02040a]">
      <Header title="Upgrade Premium" />

      <div className="flex-1 p-6 flex flex-col gap-8 max-w-[1100px] w-full mx-auto animate-slide-up">

        {/* Call to action header */}
        <div className="text-center flex flex-col items-center gap-2 max-w-lg mx-auto">
          <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-emerald-400" />
            Planos de Assinatura
          </span>
          <h2 className="text-2xl font-black text-white leading-tight">Escolha o plano ideal para suas finanças</h2>
          <p className="text-xs text-muted-foreground leading-normal">
            Seja você um estudante organizando bolsas ou um autônomo projetando retiradas PJ, a IA do FinAI acelera suas economias.
          </p>
        </div>

        {/* Pricing Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* Card: Plano Gratuito */}
          <div className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-6 border-white/5 opacity-80 hover:opacity-100 transition-all duration-300">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-white">Plano Gratuito</span>
                <span className="text-[10px] text-muted-foreground">Para começar a organizar</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">R$ 0</span>
                <span className="text-xs text-muted-foreground">/ sempre</span>
              </div>

              <div className="h-px bg-white/5 my-1"></div>

              <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                {freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {f.available ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <span className={f.available ? 'text-white/80' : 'line-through text-muted-foreground/50'}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled={!profile.isPremium}
              onClick={togglePremium}
              className={`btn-interactive-ghost w-full py-2.5 rounded-xl text-xs font-bold border ${!profile.isPremium
                  ? 'bg-white/5 border-white/10 text-muted-foreground cursor-default'
                  : 'bg-transparent border-rose-500/30 text-rose-400 hover:bg-rose-500/5'
                }`}
            >
              {!profile.isPremium ? 'Plano Ativo' : 'Voltar ao Gratuito'}
            </button>
          </div>

          {/* Card: Premium Mensal */}
          <div className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-6 border-white/5 relative">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-white">Premium Mensal</span>
                <span className="text-[10px] text-muted-foreground">Acesso ilimitado e imediato</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">R$ 19,90</span>
                <span className="text-xs text-muted-foreground">/ mês</span>
              </div>

              <div className="h-px bg-white/5 my-1"></div>

              <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                {premiumFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-white/85">{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('Premium Mensal')}
              className={`btn-interactive w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${profile.isPremium
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/15'
                }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{profile.isPremium ? 'Premium Ativo' : 'Assinar Plano'}</span>
            </button>
          </div>

          {/* Card: Premium Anual (Destaque) */}
          <div className="p-6 rounded-2xl glass-card border-violet-500/30 bg-violet-600/5 glow-violet flex flex-col justify-between gap-6 relative overflow-hidden">
            {/* Tag de Destaque */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-violet-500 to-emerald-500 text-black font-extrabold text-[8px] uppercase tracking-wider px-3 py-1 rounded-bl-xl">
              Melhor Custo
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
                  <span>Premium Anual</span>
                </span>
                <span className="text-[10px] text-violet-300">Economize mais de 15% ao ano</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">R$ 199,00</span>
                <span className="text-xs text-muted-foreground">/ ano</span>
              </div>

              <div className="h-px bg-white/5 my-1"></div>

              <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                {premiumFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-white/85">{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribe('Premium Anual')}
              className={`btn-interactive w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${profile.isPremium
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default'
                  : 'bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-400 hover:to-emerald-400 text-black shadow-lg shadow-violet-500/20'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{profile.isPremium ? 'Premium Ativo' : 'Assinar Anual'}</span>
            </button>
          </div>

        </div>

        {/* FAQ Accordions */}
        <div className="mt-6 p-5 rounded-2xl glass-card flex flex-col gap-4">
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Dúvidas Frequentes
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5">
              <span className="font-bold text-white">Como funciona a sincronização automática?</span>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos integrações Open Finance regulamentadas pelo Banco Central (via Pluggy) para ler seu extrato bancário de forma segura. O FinAI possui apenas autorização de leitura de dados, impossibilitando qualquer transação ou saque na sua conta.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5">
              <span className="font-bold text-white">Como funciona o limite gratuito de 100 lançamentos?</span>
              <p className="text-muted-foreground leading-relaxed">
                No plano Gratuito, você pode registrar até 100 lançamentos (transações manuais ou conversas) por mês. Se ultrapassar o limite, a inserção de novos gastos é bloqueada até o próximo ciclo de cobrança ou até que o upgrade Premium seja ativado.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
