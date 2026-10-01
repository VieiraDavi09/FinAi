'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useApp } from '@/providers';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertTriangle,
  Mic,
  Calendar,
  X
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { 
    profile, 
    accounts, 
    transactions, 
    insights, 
    addTransaction, 
    deleteTransaction, 
    dismissInsight 
  } = useApp();

  // Estados locais
  const [showAddModal, setShowAddModal] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  
  // Form de transação manual
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    categoryName: 'Alimentação',
    accountId: accounts[0]?.id || '',
    isCollegeRelated: false,
    collegeExpenseType: 'food' as any,
  });

  // Categorias disponíveis
  const categories = [
    'Alimentação',
    'Transporte',
    'Educação',
    'Lazer',
    'Assinaturas',
    'Moradia',
    'Faturamento',
    'Outros'
  ];

  // Cálculos financeiros
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = monthlyIncome - monthlyExpenses;

  // Processamento para Gráfico de Área (Evolução de Gastos nos últimos 7 dias)
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayLabel = d.toLocaleDateString('pt-BR', { weekday: 'short' });
    const dayString = d.toDateString();
    
    const dayExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).toDateString() === dayString)
      .reduce((sum, t) => sum + t.amount, 0);

    return { name: dayLabel, valor: dayExpenses };
  });

  // Processamento para Gráfico de Pizza (Gastos por Categoria)
  const categoryChartData = categories.map(cat => {
    const amount = transactions
      .filter(t => t.type === 'expense' && t.categoryName === cat && new Date(t.date).getMonth() === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    return { name: cat, value: amount };
  }).filter(c => c.value > 0);

  // Paleta HSL/Hexadecimal Premium de Cores para o Gráfico de Pizza
  const PIE_COLORS = [
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#0ea5e9', // sky
    '#f59e0b', // amber
    '#ec4899', // pink
    '#f43f5e', // rose
    '#6366f1', // indigo
    '#94a3b8'  // slate
  ];

  // Submete transação manual
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    try {
      addTransaction({
        accountId: formData.accountId || accounts[0]?.id || 'acc_1',
        categoryName: formData.categoryName,
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        isRecurring: false,
        isFixedCost: false,
        isCollegeRelated: formData.isCollegeRelated,
        collegeExpenseType: formData.isCollegeRelated ? formData.collegeExpenseType : undefined,
        aiCategorized: false,
      });

      // Reset
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        categoryName: 'Alimentação',
        accountId: accounts[0]?.id || '',
        isCollegeRelated: false,
        collegeExpenseType: 'food',
      });
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Simulação de Inteligência de Voz
  const handleSimulateVoice = () => {
    if (!voiceInput.trim()) return;
    setIsTranscribing(true);

    setTimeout(() => {
      setIsTranscribing(false);
      
      const txt = voiceInput.toLowerCase();
      let amount = 0;
      const numMatch = txt.match(/(\d+(?:[\.,]\d{2})?)/);
      if (numMatch) {
        amount = parseFloat(numMatch[1].replace(',', '.'));
      }

      let type: 'income' | 'expense' = 'expense';
      let category = 'Outros';
      let desc = voiceInput;

      if (txt.includes('recebi') || txt.includes('bolsa') || txt.includes('estágio') || txt.includes('salário') || txt.includes('faturei')) {
        type = 'income';
        category = txt.includes('bolsa') || txt.includes('estágio') ? 'Bolsa de Estudos' : 'Faturamento';
      } else if (txt.includes('almoço') || txt.includes('ru') || txt.includes('ifood') || txt.includes('jantar')) {
        category = 'Alimentação';
      } else if (txt.includes('uber') || txt.includes('ônibus') || txt.includes('passagem')) {
        category = 'Transporte';
      } else if (txt.includes('assinatura') || txt.includes('netflix') || txt.includes('spotify')) {
        category = 'Assinaturas';
      } else if (txt.includes('xerox') || txt.includes('livro') || txt.includes('faculdade')) {
        category = 'Educação';
      }

      try {
        addTransaction({
          accountId: accounts[0]?.id || 'acc_1',
          categoryName: category,
          type,
          amount: amount || 20,
          description: desc,
          isRecurring: false,
          isFixedCost: false,
          isCollegeRelated: profile.profileType === 'student' && (category === 'Alimentação' || category === 'Transporte' || category === 'Educação'),
          collegeExpenseType: category === 'Alimentação' ? 'food' : category === 'Transporte' ? 'transport' : category === 'Educação' ? 'books' : undefined,
          aiCategorized: true,
        });
        setVoiceInput('');
        setShowAddModal(false);
      } catch (err: any) {
        alert(err.message);
      }
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#02040a]">
      <Header title="Dashboard Principal" />
      
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-6 max-w-[1400px] w-full mx-auto animate-slide-up">
        {/* Row 1: Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Saldo */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-2 relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Saldo Disponível</span>
            <span className="text-2xl font-black text-white">R$ {totalBalance.toFixed(2)}</span>
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          </div>

          {/* Receitas */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-2 relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Entradas do Mês</span>
            <span className="text-2xl font-black text-white">R$ {monthlyIncome.toFixed(2)}</span>
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          </div>

          {/* Despesas */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-2 relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Saídas do Mês</span>
            <span className="text-2xl font-black text-rose-400">R$ {monthlyExpenses.toFixed(2)}</span>
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
          </div>

          {/* Economia */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-2 relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Economia do Mês</span>
            <span className={`text-2xl font-black ${netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              R$ {netSavings.toFixed(2)}
            </span>
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Row 2: Gráficos e Lançamento Rápido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Evolução Semanal */}
          <div className="lg:col-span-2 p-5 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Despesas Diárias (Últimos 7 dias)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7DaysData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0d111e', borderColor: '#1e293b', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Pizza das Categorias */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Distribuição por Categoria</h3>
            {categoryChartData.length > 0 ? (
              <div className="h-44 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#0d111e', borderColor: '#1e293b', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Indicador de Despesa Total no Centro */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Saídas</span>
                  <span className="text-sm font-black text-rose-400">R$ {monthlyExpenses.toFixed(0)}</span>
                </div>
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center text-xs text-muted-foreground text-center">
                Sem despesas registradas este mês.
              </div>
            )}
            {/* Legenda das Categorias */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categoryChartData.slice(0, 4).map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 truncate">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                  <span className="text-muted-foreground truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Insights de Desperdício & Transações Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Insights (Detector de Desperdícios) */}
          <div className="p-5 rounded-2xl glass-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-violet-400" />
                <span>Detector de Desperdícios IA</span>
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {insights.length > 0 ? (
                insights.map((insight) => (
                  <div key={insight.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2 relative">
                    <button 
                      onClick={() => dismissInsight(insight.id)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        insight.category === 'waste' 
                          ? 'bg-rose-500/20 text-rose-400' 
                          : insight.category === 'alert' 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : 'bg-violet-500/20 text-violet-400'
                      }`}>
                        {insight.category === 'waste' ? 'Desperdício' : insight.category === 'alert' ? 'Alerta' : 'Tendência'}
                      </span>
                      {insight.impactAmount && (
                        <span className="text-xs font-semibold text-emerald-400">
                          Salva R$ {insight.impactAmount.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-xs text-white mt-1">{insight.title}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Sem alertas no momento. A IA continuará monitorando seus lançamentos!
                </div>
              )}
            </div>
          </div>

          {/* Transações Recentes */}
          <div className="lg:col-span-2 p-5 rounded-2xl glass-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Atividades Recentes</h3>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition-all duration-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Lançar</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground">
                    <th className="py-2.5 font-medium">Descrição</th>
                    <th className="py-2.5 font-medium">Categoria</th>
                    <th className="py-2.5 font-medium">Data</th>
                    <th className="py-2.5 font-medium text-right">Valor</th>
                    <th className="py-2.5 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {transactions.slice(0, 6).map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-all">
                      <td className="py-3 font-semibold text-white">
                        {tx.description}
                        {tx.aiCategorized && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-violet-600/20 text-violet-400 text-[8px] font-bold uppercase">
                            IA
                          </span>
                        )}
                        {tx.isCollegeRelated && (
                          <span className="ml-1 px-1.5 py-0.5 rounded bg-emerald-600/20 text-emerald-400 text-[8px] font-bold uppercase">
                            Faculdade
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-muted-foreground">{tx.categoryName}</td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className={`py-3 font-bold text-right ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3 text-center">
                        <button 
                          onClick={() => deleteTransaction(tx.id)}
                          className="text-muted-foreground hover:text-rose-400 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE ADICIONAR TRANSAÇÃO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#070913] border border-border/80 rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            {/* Header Modal */}
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <span className="font-bold text-white">Novo Lançamento</span>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Abas: Manual vs Voz */}
            <div className="p-4 flex flex-col gap-4">
              {/* Voz IA */}
              <div className="p-4 rounded-xl bg-violet-600/5 border border-violet-500/10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-semibold text-violet-300">Lançamento de Voz Inteligente</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Simule o envio de uma mensagem de áudio ou texto falado. A IA extrairá o valor, a categoria e a data automaticamente.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={voiceInput}
                    onChange={(e) => setVoiceInput(e.target.value)}
                    placeholder="Ex: Almocei no RU hoje e gastei 3 reais"
                    className="flex-1 bg-[#02040a] border border-border/60 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSimulateVoice()}
                  />
                  <button
                    onClick={handleSimulateVoice}
                    disabled={isTranscribing}
                    className="px-3 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:bg-violet-800 disabled:text-muted-foreground text-black text-xs font-bold transition-all"
                  >
                    {isTranscribing ? 'Processando...' : 'Simular'}
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-border/20"></div>
                <span className="flex-shrink mx-4 text-muted-foreground text-[10px] uppercase font-bold">ou preencha manualmente</span>
                <div className="flex-grow border-t border-border/20"></div>
              </div>

              {/* Form Manual */}
              <form onSubmit={handleAddSubmit} className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1">Descrição</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Compra de Mercado"
                    className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1">Valor (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Tipo</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="expense">Saída / Despesa</option>
                      <option value="income">Entrada / Receita</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1">Categoria</label>
                    <select
                      value={formData.categoryName}
                      onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                      className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Conta Vinculada</label>
                    <select
                      value={formData.accountId}
                      onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                      className="w-full bg-[#02040a] border border-border/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {profile.profileType === 'student' && (
                  <div className="flex items-center gap-2 p-2 rounded bg-white/5 border border-white/5 mt-1">
                    <input
                      type="checkbox"
                      id="isCollegeRelated"
                      checked={formData.isCollegeRelated}
                      onChange={(e) => setFormData({ ...formData, isCollegeRelated: e.target.checked })}
                      className="w-3.5 h-3.5 border-border rounded accent-emerald-500"
                    />
                    <label htmlFor="isCollegeRelated" className="text-[10px] text-white font-medium cursor-pointer">
                      Esta transação é relacionada à faculdade?
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 mt-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all"
                >
                  Salvar Transação
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
