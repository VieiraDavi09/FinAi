'use strict';
'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useApp } from '@/providers';
import { ai } from '@/lib/ai';
import { 
  GraduationCap, 
  Sparkles, 
  HelpCircle, 
  TrendingDown, 
  AlertTriangle, 
  TrendingUp, 
  Coffee,
  Bus,
  BookOpen,
  Wine,
  Wallet
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function Universitario() {
  const { profile, setProfileType, transactions, accounts } = useApp();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // Calcula balanço universitário
  const collegeTxs = transactions.filter(t => t.isCollegeRelated);
  const collegeExpenses = collegeTxs.filter(t => t.type === 'expense');
  const collegeIncomes = collegeTxs.filter(t => t.type === 'income');

  const totalCollegeIncome = collegeIncomes.reduce((sum, t) => sum + t.amount, 0);
  const totalCollegeExpense = collegeExpenses.reduce((sum, t) => sum + t.amount, 0);
  
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  // Gastos por categoria universitária
  const expenseTypes = [
    { type: 'food', label: 'Alimentação / RU', icon: Coffee, color: '#10b981' },
    { type: 'transport', label: 'Transporte / Ônibus', icon: Bus, color: '#8b5cf6' },
    { type: 'books', label: 'Materiais / Xerox', icon: BookOpen, color: '#0ea5e9' },
    { type: 'parties', label: 'Lazer / Festas', icon: Wine, color: '#f59e0b' },
  ];

  const chartData = expenseTypes.map(item => {
    const amount = collegeExpenses
      .filter(t => t.collegeExpenseType === item.type)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: item.label, valor: amount, color: item.color };
  }).filter(d => d.valor > 0);

  // Simulação de risco de caixa (algoritmo dinâmico simples)
  const today = new Date().getDate();
  const daysRemaining = 30 - today;
  const estimatedRUEvents = Math.max(0, daysRemaining * 2); 
  const ruCost = estimatedRUEvents * 3.00; 
  const transportCost = Math.max(0, daysRemaining * 8.00); 

  const basicSurvival = ruCost + transportCost;
  const securityPct = Math.min(100, Math.max(0, (totalBalance / (basicSurvival || 1)) * 100));

  let safetyStatus = 'status-green';
  let safetyText = 'Caixa Confortável';
  let safetyDesc = 'Seu saldo atual cobre com tranquilidade o RU e transporte até o fim do mês.';

  if (securityPct < 50) {
    safetyStatus = 'status-red';
    safetyText = 'Caixa Crítico';
    safetyDesc = 'Cuidado! Seu saldo atual é insuficiente para as despesas básicas da faculdade até o final do mês.';
  } else if (securityPct < 150) {
    safetyStatus = 'status-yellow';
    safetyText = 'Zona de Atenção';
    safetyDesc = 'Seu saldo cobre o básico, mas qualquer imprevisto ou gasto de lazer pode zerar sua conta.';
  }

  // Aciona pergunta pré-definida para a IA
  const handleAskAI = async (question: string) => {
    setAiLoading(true);
    setAiAnswer(null);
    try {
      const res = await ai.askCopilot(question);
      setAiAnswer(res.answer);
    } catch (err) {
      setAiAnswer('Desculpe, ocorreu um erro ao se conectar ao copiloto financeiro.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#02040a]">
      <Header title="Modo Universitário" />

      <div className="flex-1 p-6 flex flex-col gap-6 max-w-[1200px] w-full mx-auto animate-slide-up">
        {/* Banner de Aviso de Perfil */}
        {profile.profileType !== 'student' && (
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-yellow-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Perfil Atual Não Estudante
              </span>
              <p className="text-muted-foreground mt-0.5">
                Você está visualizando o Modo Universitário, mas seu perfil está configurado como **{profile.profileType === 'freelancer' ? 'Freelancer' : 'Padrão'}**.
              </p>
            </div>
            <button
              onClick={() => setProfileType('student')}
              className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold shrink-0 transition-all"
            >
              Ativar Modo Estudante
            </button>
          </div>
        )}

        {/* Header Seção */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Estudante Copiloto</span>
            <span className="text-lg font-extrabold text-white">Planejamento Universitário</span>
          </div>
        </div>

        {/* Risco de Caixa & Visão Geral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Caixa de Risco */}
          <div className="p-5 rounded-2xl glass-card flex flex-col justify-between gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Saúde do Caixa Escolar</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                safetyStatus === 'status-green' 
                  ? 'bg-emerald-500/25 text-emerald-400' 
                  : safetyStatus === 'status-yellow' 
                  ? 'bg-yellow-500/25 text-yellow-400' 
                  : 'bg-rose-500/25 text-rose-400'
              }`}>
                {safetyText}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-2xl font-black text-white">{securityPct.toFixed(0)}%</span>
              <span className="text-[10px] text-muted-foreground">Cobertura do orçamento de sobrevivência</span>
            </div>

            {/* Barra de Progresso do Risco */}
            <div className="w-full">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    safetyStatus === 'status-green' 
                      ? 'bg-emerald-500' 
                      : safetyStatus === 'status-yellow' 
                      ? 'bg-yellow-500' 
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, securityPct)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                {safetyDesc}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          </div>

          {/* Bolsa & Estágios */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Fontes de Renda</span>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-white">Bolsa CNPq / Iniciação</span>
                  <span className="text-[10px] text-muted-foreground">Depósito recorrente</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">+ R$ 700,00</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-white">Estágio Desenvolvimento</span>
                  <span className="text-[10px] text-muted-foreground">Mensal fixo</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">+ R$ 900,00</span>
              </div>
            </div>
          </div>

          {/* Saldo de Campus */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Orçamento Universitário</span>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Receitas do Campus</span>
                <span className="font-bold text-white">R$ {totalCollegeIncome.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Gastos do Campus</span>
                <span className="font-bold text-rose-400">R$ {totalCollegeExpense.toFixed(2)}</span>
              </div>
              <div className="border-t border-border/40 my-1"></div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Margem Universitária</span>
                <span className={`font-black ${totalCollegeIncome - totalCollegeExpense >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {(totalCollegeIncome - totalCollegeExpense).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Simulador de Orçamento da IA & Histórico de Gastos do Campus */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulador AI */}
          <div className="lg:col-span-2 p-5 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Simulador Financeiro do Estudante</span>
            </h3>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Selecione uma pergunta frequente de estudantes para que o copiloto analise seu saldo atual:
              </p>
              
              <div className="flex flex-wrap gap-2 mt-1">
                <button
                  onClick={() => handleAskAI('Posso gastar R$ 200 este fim de semana?')}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-xs text-white transition-all text-left"
                >
                  "Posso gastar R$ 200 este fim de semana?"
                </button>
                <button
                  onClick={() => handleAskAI('Meu dinheiro dura até o final do mês?')}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-xs text-white transition-all text-left"
                >
                  "Meu dinheiro dura até o final do mês?"
                </button>
                <button
                  onClick={() => handleAskAI('Vale a pena parcelar compras?')}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-xs text-white transition-all text-left"
                >
                  "Vale a pena parcelar compras da faculdade?"
                </button>
              </div>
            </div>

            {/* Resposta do Copiloto */}
            {(aiLoading || aiAnswer) && (
              <div className="p-4 rounded-xl bg-violet-600/5 border border-violet-500/15 flex flex-col gap-2 relative animate-fade-in mt-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Copiloto IA</span>
                </div>
                {aiLoading ? (
                  <div className="flex flex-col gap-1.5 py-2">
                    <div className="h-3 bg-white/5 rounded w-3/4 shimmer"></div>
                    <div className="h-3 bg-white/5 rounded w-5/6 shimmer"></div>
                    <div className="h-3 bg-white/5 rounded w-2/3 shimmer"></div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {aiAnswer}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gráfico de Barras de Gastos no Campus */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Despesas de Campus</h3>
            {chartData.length > 0 ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ background: '#0d111e', borderColor: '#1e293b', borderRadius: '8px' }} />
                    <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-muted-foreground">
                Nenhuma despesa de faculdade registrada. Marque o checkbox "Relacionado à faculdade" ao lançar despesas no dashboard!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
