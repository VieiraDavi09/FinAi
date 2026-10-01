'use strict';
'use client';

import React from 'react';
import Header from '@/components/Header';
import { useApp } from '@/providers';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Lock, 
  Gift, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Desafios() {
  const { profile, challenges, completeChallenge } = useApp();

  // Nível do Usuário baseado nos pontos (ex: cada 500xp = 1 nível)
  const currentLevel = Math.floor(profile.points / 500) + 1;
  const xpInCurrentLevel = profile.points % 500;
  const xpNeededForNextLevel = 500 - xpInCurrentLevel;
  const levelProgressPct = (xpInCurrentLevel / 500) * 100;

  // Lista de Medalhas/Conquistas Simplicadas
  const achievements = [
    { id: 'a_1', title: 'Adeus Assinaturas', desc: 'Cancelou uma assinatura recorrente', points: 100, unlocked: true },
    { id: 'a_2', title: 'Sobrevivente do Mês', desc: 'Chegou ao dia 30 com saldo positivo', points: 150, unlocked: true },
    { id: 'a_3', title: 'Poupador Campeão', desc: 'Guardou os primeiros R$ 1.000', points: 300, unlocked: profile.points >= 500 },
    { id: 'a_4', title: 'Mestre Freelancer', desc: 'Faturou mais de R$ 5.000 no mês', points: 400, unlocked: profile.profileType === 'freelancer' && profile.points >= 600 },
    { id: 'a_5', title: 'Foco de Ouro', desc: 'Atingiu 7 dias de ofensiva diária', points: 200, unlocked: profile.streakDays >= 7 },
  ];

  // Executa conclusão do desafio
  const handleComplete = (id: string, title: string, points: number) => {
    try {
      completeChallenge(id);
      
      // Efeito sonoro/visual
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#8b5cf6']
      });

      // Feedback curto do sistema
      alert(`Parabéns! Desafio "${title}" concluído. +${points} XP adicionados ao seu perfil! 🎉`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#02040a]">
      <Header title="Desafios e Conquistas" />

      <div className="flex-1 p-6 flex flex-col gap-6 max-w-[1200px] w-full mx-auto animate-slide-up">
        
        {/* Painel do Placar de Gamificação */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d111e]/90 to-[#1b1238]/60 border border-violet-500/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Lado Esquerdo: Level e XP */}
          <div className="flex items-center gap-5 z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-400 flex items-center justify-center text-black shadow-lg shadow-yellow-500/15">
              <Trophy className="w-8 h-8 font-black" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-violet-300 font-bold uppercase tracking-wider">Nível {currentLevel}</span>
              <span className="text-xl font-extrabold text-white">
                {currentLevel === 1 ? 'Poupador Iniciante' : currentLevel === 2 ? 'Investidor Júnior' : 'Mestre do Orçamento'}
              </span>
              
              {/* Barra de Progresso */}
              <div className="w-64 mt-1.5">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${levelProgressPct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                  <span>{xpInCurrentLevel} XP</span>
                  <span>Faltam {xpNeededForNextLevel} XP para o Nível {currentLevel + 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: Ofensiva e Pontuação */}
          <div className="flex items-center gap-8 z-10">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Pontos Acumulados</span>
              <span className="text-3xl font-black text-yellow-400">{profile.points} <span className="text-xs text-muted-foreground">XP</span></span>
            </div>
            
            <div className="h-10 border-r border-border/40"></div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Ofensiva Financeira</span>
              <div className="flex items-center gap-1">
                <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                <span className="text-3xl font-black text-white">{profile.streakDays} <span className="text-xs text-muted-foreground">dias</span></span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl"></div>
        </div>

        {/* Desafios Ativos e Sugestão IA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lista de Desafios Ativos */}
          <div className="lg:col-span-2 p-5 rounded-2xl glass-card flex flex-col gap-4">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Missões Semanais</span>
            <h3 className="text-base font-extrabold text-white">Desafios de Economia Ativos</h3>

            <div className="flex flex-col gap-3.5">
              {challenges.map((challenge) => {
                const isActive = challenge.status === 'active';
                return (
                  <div 
                    key={challenge.id}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                      isActive 
                        ? 'bg-white/5 border-white/5 hover:border-white/10' 
                        : 'bg-emerald-500/5 border-emerald-500/20'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{challenge.title}</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 font-bold rounded">
                          +{challenge.pointsReward} XP
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground max-w-md">{challenge.description}</p>
                      <span className="text-[10px] text-emerald-400 font-semibold mt-1">
                        Meta de economia: R$ {challenge.targetSavings.toFixed(2)}
                      </span>
                    </div>

                    {isActive ? (
                      <button
                        onClick={() => handleComplete(challenge.id, challenge.title, challenge.pointsReward)}
                        className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shrink-0 transition-all"
                      >
                        Completar
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Concluído</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sugestões da IA / Próxima Recompensa */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                <span>Recomendações do Copiloto</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A IA analisou seus relatórios de despesas e criou um desafio exclusivo para você acumular XP rápidos:
              </p>
              
              <div className="p-4 rounded-xl bg-violet-600/10 border border-violet-500/20 flex flex-col gap-2 mt-1">
                <span className="font-bold text-xs text-violet-300">Desafio: Mobilidade Consciente</span>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Reduza os gastos com Uber em 15% na próxima semana. Tente usar ônibus, metrô ou ir a pé em trajetos curtos.
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className="text-emerald-400 font-semibold">Salva R$ 35,00</span>
                  <span className="bg-violet-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                    +250 XP
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-between text-xs mt-4">
              <span className="text-muted-foreground">Resgate prêmios na loja</span>
              <button className="text-yellow-400 font-bold flex items-center gap-0.5 hover:underline">
                <span>Ver Prêmios</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Quadro de Conquistas (Medalhas) */}
        <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Álbum de Medalhas</span>
          <h3 className="text-base font-extrabold text-white">Suas Conquistas</h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {achievements.map((a) => (
              <div 
                key={a.id}
                className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                  a.unlocked 
                    ? 'bg-white/5 border-white/5 hover:bg-white/10' 
                    : 'bg-black/40 border-white/5 opacity-40 select-none'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  a.unlocked 
                    ? 'bg-gradient-to-tr from-violet-600 to-emerald-600 text-white shadow' 
                    : 'bg-white/5 text-muted-foreground'
                }`}>
                  {a.unlocked ? (
                    <Award className="w-6 h-6 text-yellow-300" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-xs text-white truncate max-w-[120px]">{a.title}</span>
                  <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2 max-w-[120px]">
                    {a.desc}
                  </p>
                </div>
                
                <span className="text-[9px] font-bold text-yellow-400/80 mt-1">
                  {a.unlocked ? 'Desbloqueado' : `+${a.points} XP`}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
