'use strict';
'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useApp } from '@/providers';
import { ai } from '@/lib/ai';
import { 
  Briefcase, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  User,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

export default function Freelancer() {
  const { profile, setProfileType, accounts, transactions, addTransaction } = useApp();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  
  // Controle de novos contratos / invoices
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    client: '',
    project: '',
    amount: '',
    status: 'pending' as 'paid' | 'pending' | 'in_progress',
  });

  // Lista fixa/inicial de Jobs
  const [jobs, setJobs] = useState([
    { id: 'j_1', client: 'Loja Variedades S.A.', project: 'Web App E-commerce', amount: 4500.00, status: 'paid' },
    { id: 'j_2', client: 'Imobiliária Lins', project: 'Manutenção Mensal API', amount: 2500.00, status: 'pending' },
    { id: 'j_3', client: 'Academia Corpo & Vida', project: 'Redesign UI/UX Dashboard', amount: 1800.00, status: 'in_progress' },
  ]);

  // Cálculos financeiros
  const pjAccount = accounts.find(a => a.id === 'acc_free_1') || accounts[0];
  const pfAccount = accounts.find(a => a.id === 'acc_free_2') || accounts[1] || accounts[0];

  const pjBalance = pjAccount?.balance || 0;
  const pfBalance = pfAccount?.balance || 0;

  // Custos Operacionais da Empresa
  const operatingCosts = transactions
    .filter(t => t.type === 'expense' && t.isFixedCost)
    .reduce((sum, t) => sum + t.amount, 0);

  // Estimativa de Impostos (Ex: 6% Simples Nacional brasileiro)
  const monthlyInvoicing = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  const projectedTax = monthlyInvoicing * 0.06;

  // Retirada Segura Recomendada
  const safeWithdrawalLimit = Math.max(0, (pjBalance - operatingCosts - projectedTax) * 0.7);

  // Switch de Status de Jobs
  const toggleJobStatus = (id: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === id) {
        let nextStatus: 'paid' | 'pending' | 'in_progress' = 'pending';
        if (job.status === 'pending') nextStatus = 'paid';
        else if (job.status === 'paid') nextStatus = 'in_progress';
        
        // Se mudou para pago, adiciona receita
        if (nextStatus === 'paid') {
          try {
            addTransaction({
              accountId: pjAccount.id,
              categoryName: 'Freelance Faturamento',
              type: 'income',
              amount: job.amount,
              description: `Recebimento: ${job.project} - ${job.client}`,
              isRecurring: false,
              isFixedCost: false,
              isCollegeRelated: false,
              clientName: job.client,
              aiCategorized: true,
            });
          } catch(e) {}
        }
        return { ...job, status: nextStatus };
      }
      return job;
    }));
  };

  // Cadastra Novo Job
  const handleAddJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.client || !newJob.project || !newJob.amount) return;

    const amountNum = parseFloat(newJob.amount);
    const jobObj = {
      id: 'j_' + Math.random().toString(36).substr(2, 9),
      client: newJob.client,
      project: newJob.project,
      amount: amountNum,
      status: newJob.status,
    };

    setJobs([...jobs, jobObj]);
    
    // Se o job já estiver pago, lança no financeiro PJ
    if (newJob.status === 'paid') {
      try {
        addTransaction({
          accountId: pjAccount.id,
          categoryName: 'Freelance Faturamento',
          type: 'income',
          amount: amountNum,
          description: `Recebimento: ${newJob.project} - ${newJob.client}`,
          isRecurring: false,
          isFixedCost: false,
          isCollegeRelated: false,
          clientName: newJob.client,
          aiCategorized: true,
        });
      } catch (err: any) {
        alert(err.message);
      }
    }

    setNewJob({ client: '', project: '', amount: '', status: 'pending' });
    setShowAddJobModal(false);
  };

  const handleAskAI = async (question: string) => {
    setAiLoading(true);
    setAiAnswer(null);
    try {
      const res = await ai.askCopilot(question);
      setAiAnswer(res.answer);
    } catch (err) {
      setAiAnswer('Erro ao obter dados da inteligência artificial.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#02040a]">
      <Header title="Copiloto Freelancer & Autônomo" />

      <div className="flex-1 p-6 flex flex-col gap-6 max-w-[1200px] w-full mx-auto animate-slide-up">
        {/* Banner de Aviso de Perfil */}
        {profile.profileType !== 'freelancer' && (
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-yellow-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Perfil Atual Não Freelancer
              </span>
              <p className="text-muted-foreground mt-0.5">
                Você está visualizando o painel de faturamento corporativo, mas seu perfil está configurado como **{profile.profileType === 'student' ? 'Estudante' : 'Padrão'}**.
              </p>
            </div>
            <button
              onClick={() => setProfileType('freelancer')}
              className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-semibold shrink-0 transition-all"
            >
              Ativar Perfil Freelancer
            </button>
          </div>
        )}

        {/* Top Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">PJ & PF Integration</span>
            <span className="text-lg font-extrabold text-white">Gestão Financeira para Autônomos</span>
          </div>
        </div>

        {/* Métricas Fluxo de Caixa PJ vs PF */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-1.5 relative overflow-hidden">
            <Building2 className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-xs text-muted-foreground">Saldo PJ (Empresa)</span>
            <span className="text-xl font-black text-white">R$ {pjBalance.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground">Nubank PJ</span>
          </div>
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-1.5 relative overflow-hidden">
            <User className="w-5 h-5 text-violet-400 mb-1" />
            <span className="text-xs text-muted-foreground">Saldo PF (Pessoal)</span>
            <span className="text-xl font-black text-white">R$ {pfBalance.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground">Nubank PF</span>
          </div>
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-1.5 relative overflow-hidden">
            <TrendingDown className="w-5 h-5 text-rose-400 mb-1" />
            <span className="text-xs text-muted-foreground">Impostos Projetados (6%)</span>
            <span className="text-xl font-black text-rose-400">R$ {projectedTax.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground">Provisão Simples Nacional</span>
          </div>
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-1.5 relative overflow-hidden">
            <Sparkles className="w-5 h-5 text-yellow-400 mb-1" />
            <span className="text-xs text-muted-foreground">Retirada Máxima Segura</span>
            <span className="text-xl font-black text-emerald-400">R$ {safeWithdrawalLimit.toFixed(2)}</span>
            <span className="text-[10px] text-muted-foreground">Reserva de capital inclusa</span>
          </div>
        </div>

        {/* Invoices e Simulador IA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rastreador de Projetos / Jobs */}
          <div className="lg:col-span-2 p-5 rounded-2xl glass-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Invoices e Clientes</h3>
              <button
                onClick={() => setShowAddJobModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Job</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-xs text-white">{job.project}</span>
                    <span className="text-[10px] text-muted-foreground">{job.client}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-xs text-white">R$ {job.amount.toFixed(2)}</span>
                    
                    {/* Status Badge clicável para alternar */}
                    <button
                      onClick={() => toggleJobStatus(job.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 transition-all ${
                        job.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : job.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse'
                          : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      }`}
                    >
                      {job.status === 'paid' ? (
                        <>
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>Pago</span>
                        </>
                      ) : job.status === 'pending' ? (
                        <>
                          <AlertCircle className="w-2.5 h-2.5" />
                          <span>Cobrar</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-2.5 h-2.5" />
                          <span>Fazer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulador Copiloto Freelancer */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Oráculo Freelancer (IA)</span>
            </h3>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Consulte a IA sobre sua saúde financeira corporativa baseada nas oscilações de faturamento deste mês:
            </p>

            <div className="flex flex-col gap-2 mt-1">
              <button
                onClick={() => handleAskAI('Quanto posso retirar de pró-labore este mês?')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/40 hover:bg-violet-500/5 text-xs text-white transition-all"
              >
                "Quanto posso retirar este mês?"
              </button>
              <button
                onClick={() => handleAskAI('Qual será meu caixa da empresa daqui a 30 dias?')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/40 hover:bg-violet-500/5 text-xs text-white transition-all"
              >
                "Qual meu faturamento e custo fixo?"
              </button>
            </div>

            {(aiLoading || aiAnswer) && (
              <div className="p-3.5 rounded-xl bg-violet-600/5 border border-violet-500/15 flex flex-col gap-2 relative animate-fade-in mt-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Copiloto IA</span>
                </div>
                {aiLoading ? (
                  <div className="flex flex-col gap-1.5 py-1.5">
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
        </div>
      </div>

      {/* MODAL ADICIONAR JOB */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#070913] border border-border/80 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Novo Contrato / Faturamento</span>
              </span>
              <button onClick={() => setShowAddJobModal(false)} className="text-muted-foreground hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddJobSubmit} className="p-4 flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Cliente</label>
                <input
                  type="text"
                  required
                  value={newJob.client}
                  onChange={(e) => setNewJob({ ...newJob, client: e.target.value })}
                  placeholder="Ex: Startup Tech Ltda, João Silva"
                  className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Projeto / Escopo</label>
                <input
                  type="text"
                  required
                  value={newJob.project}
                  onChange={(e) => setNewJob({ ...newJob, project: e.target.value })}
                  placeholder="Ex: Landing Page de Vendas"
                  className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1">Valor do Job (R$)</label>
                  <input
                    type="number"
                    required
                    value={newJob.amount}
                    onChange={(e) => setNewJob({ ...newJob, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Status de Início</label>
                  <select
                    value={newJob.status}
                    onChange={(e) => setNewJob({ ...newJob, status: e.target.value as any })}
                    className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pending">Cobrança Pendente / Boleto Emitido</option>
                    <option value="paid">Pago / Liquidado em Conta PJ</option>
                    <option value="in_progress">Job Em Desenvolvimento</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all"
              >
                Cadastrar Job
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
