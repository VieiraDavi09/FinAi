'use strict';
'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useApp } from '@/providers';
import { 
  Plus, 
  PiggyBank, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  TrendingUp, 
  DollarSign, 
  Trash2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Cofrinho() {
  const { 
    profile, 
    goals, 
    addGoal, 
    depositGoal, 
    deleteGoal 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  
  // Form de nova meta
  const [newGoalData, setNewGoalData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    category: 'electronics',
  });

  // Form de depósito
  const [depositAmount, setDepositAmount] = useState('');

  // Abre modal de depósito
  const handleOpenDeposit = (id: string) => {
    setSelectedGoalId(id);
    setShowDepositModal(true);
  };

  // Submete depósito
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !depositAmount) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    const goal = goals.find(g => g.id === selectedGoalId);
    if (!goal) return;

    depositGoal(selectedGoalId, amount);
    
    // Dispara Confetti se completou a meta ou atingiu marco
    const newTotal = goal.currentAmount + amount;
    if (newTotal >= goal.targetAmount) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#8b5cf6', '#3b82f6', '#f59e0b']
      });
    } else {
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.7 }
      });
    }

    setDepositAmount('');
    setShowDepositModal(false);
  };

  // Submete nova meta
  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalData.name || !newGoalData.targetAmount || !newGoalData.targetDate) return;

    try {
      const target = parseFloat(newGoalData.targetAmount);
      const initial = parseFloat(newGoalData.currentAmount || '0');
      
      const targetDateObj = new Date(newGoalData.targetDate);
      const diffTime = targetDateObj.getTime() - Date.now();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let term: 'short' | 'medium' | 'long' = 'short';
      if (diffDays > 365) term = 'long';
      else if (diffDays > 90) term = 'medium';

      addGoal({
        name: newGoalData.name,
        targetAmount: target,
        currentAmount: initial,
        targetDate: newGoalData.targetDate,
        category: newGoalData.category,
        term,
        aiInsights: `Meta criada! Você precisa economizar cerca de R$ ${((target - initial) / Math.max(1, diffDays)).toFixed(2)}/dia para alcançar o objetivo no prazo.`
      });

      // Reset
      setNewGoalData({
        name: '',
        targetAmount: '',
        currentAmount: '0',
        targetDate: '',
        category: 'electronics',
      });
      setShowAddModal(false);
      
      // Efeito sonoro/visual
      confetti({ particleCount: 30, spread: 20 });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#02040a]">
      <Header title="Cofrinho IA - Metas Inteligentes" />

      <div className="flex-1 p-6 flex flex-col gap-6 max-w-[1200px] w-full mx-auto animate-slide-up">
        {/* Banner de Status do Plano */}
        {!profile.isPremium && (
          <div className="p-4 rounded-xl bg-violet-600/10 border border-violet-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-violet-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Limite de Metas Ativo (Plano Gratuito)
              </span>
              <p className="text-muted-foreground mt-0.5">
                Você está utilizando **{goals.length}/3** metas ativas. Faça o upgrade para definir objetivos ilimitados!
              </p>
            </div>
          </div>
        )}

        {/* Top Header com Ações */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Cofrinho IA</span>
            <span className="text-lg font-extrabold text-white">Seus Objetivos de Economia</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all duration-300 shadow-lg shadow-emerald-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Meta</span>
          </button>
        </div>

        {/* Grid de Metas */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progressPct = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
              
              // Calcula tempo restante
              const daysLeft = Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
              const monthsLeft = (daysLeft / 30.4).toFixed(1);

              return (
                <div 
                  key={goal.id} 
                  className={`p-5 rounded-2xl glass-card flex flex-col justify-between gap-5 relative overflow-hidden ${
                    goal.isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : ''
                  }`}
                >
                  {/* Categoria & Status */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/5 text-muted-foreground">
                      {goal.category === 'electronics' ? 'Tecnologia' : goal.category === 'emergency_fund' ? 'Reserva de Emergência' : goal.category === 'travel' ? 'Viagem' : 'Outros'}
                    </span>
                    {goal.isCompleted ? (
                      <span className="text-[9px] px-2 py-0.5 bg-emerald-500 text-black font-extrabold rounded-full uppercase tracking-wider">
                        Concluído 🚀
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Faltam {daysLeft} dias (~{monthsLeft} meses)</span>
                      </span>
                    )}
                  </div>

                  {/* Nome e Valores */}
                  <div className="flex flex-col gap-1 z-10">
                    <span className="text-base font-extrabold text-white">{goal.name}</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-xl font-black text-emerald-400">R$ {goal.currentAmount.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">Meta: R$ {goal.targetAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full z-10">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>{progressPct.toFixed(0)}% concluído</span>
                      <span>Restam R$ {remaining.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* IA Insight */}
                  {goal.aiInsights && (
                    <div className="p-3.5 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-start gap-2.5 z-10">
                      <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Copiloto IA</span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{goal.aiInsights}</p>
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex items-center gap-2 mt-2 z-10">
                    {!goal.isCompleted && (
                      <button
                        onClick={() => handleOpenDeposit(goal.id)}
                        className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all flex items-center justify-center gap-1"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Guardar Dinheiro</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Deseja excluir esta meta permanentemente?')) {
                          deleteGoal(goal.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-muted-foreground hover:text-rose-400 transition-all"
                      title="Excluir Meta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4 glass-card rounded-2xl">
            <PiggyBank className="w-12 h-12 text-muted-foreground animate-bounce" />
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-white">Nenhuma Meta Definida</span>
              <p className="text-xs text-muted-foreground max-w-sm">
                Crie um objetivo para comprar seu celular, notebook ou criar sua reserva. O Copiloto IA ajudará você a economizar!
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs"
            >
              Criar Primeira Meta
            </button>
          </div>
        )}
      </div>

      {/* MODAL DE ADICIONAR META */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#070913] border border-border/80 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4 text-emerald-400" />
                <span>Nova Meta de Economia</span>
              </span>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="p-4 flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Nome do Objetivo</label>
                <input
                  type="text"
                  required
                  value={newGoalData.name}
                  onChange={(e) => setNewGoalData({ ...newGoalData, name: e.target.value })}
                  placeholder="Ex: Notebook para Faculdade, Viagem..."
                  className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1">Valor Alvo (R$)</label>
                  <input
                    type="number"
                    required
                    value={newGoalData.targetAmount}
                    onChange={(e) => setNewGoalData({ ...newGoalData, targetAmount: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Valor Já Guardado (R$)</label>
                  <input
                    type="number"
                    value={newGoalData.currentAmount}
                    onChange={(e) => setNewGoalData({ ...newGoalData, currentAmount: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1">Prazo de Conclusão</label>
                  <input
                    type="date"
                    required
                    value={newGoalData.targetDate}
                    onChange={(e) => setNewGoalData({ ...newGoalData, targetDate: e.target.value })}
                    className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1">Categoria</label>
                  <select
                    value={newGoalData.category}
                    onChange={(e) => setNewGoalData({ ...newGoalData, category: e.target.value })}
                    className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="electronics">Tecnologia / Eletrônicos</option>
                    <option value="emergency_fund">Reserva de Emergência</option>
                    <option value="travel">Viagem</option>
                    <option value="car">Carro / Veículo</option>
                    <option value="other">Outros</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all"
              >
                Criar Meta
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DEPÓSITO */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#070913] border border-border/80 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Guardar no Cofrinho</span>
              </span>
              <button onClick={() => setShowDepositModal(false)} className="text-muted-foreground hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="p-4 flex flex-col gap-4 text-xs">
              <p className="text-muted-foreground leading-normal text-[11px]">
                Informe o valor que deseja depositar nesta meta. O saldo geral de suas contas será atualizado correspondendo a essa transferência.
              </p>
              <div>
                <label className="block text-muted-foreground mb-1">Valor do Depósito (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all"
              >
                Confirmar Depósito
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
