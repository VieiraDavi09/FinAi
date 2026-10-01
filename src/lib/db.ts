// Engine de Dados Híbrida para FinAI (LocalStorage + Mock Supabase Fallback)

export type ProfileType = 'standard' | 'student' | 'freelancer';
export type TransactionType = 'income' | 'expense';
export type TargetTerm = 'short' | 'medium' | 'long';
export type ChallengeStatus = 'active' | 'completed' | 'failed';

export interface Profile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  profileType: ProfileType;
  points: number;
  streakDays: number;
  monthlyLimitTransactions: number;
  isPremium: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId?: string;
  categoryName: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  isRecurring: boolean;
  isFixedCost: boolean;
  
  // Modo Universitário
  isCollegeRelated: boolean;
  collegeExpenseType?: 'food' | 'transport' | 'books' | 'tuition' | 'parties' | 'other';
  
  // Modo Freelancer
  clientName?: string;
  freelanceProjectId?: string;
  
  // IA metadata
  aiCategorized: boolean;
  aiConfidence?: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  term: TargetTerm;
  category: string;
  isCompleted: boolean;
  aiInsights?: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  impactAmount?: number;
  category: 'waste' | 'alert' | 'trend' | 'educational';
  dismissed: boolean;
  actionTaken: boolean;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetSavings: number;
  pointsReward: number;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

// Chaves LocalStorage
const KEYS = {
  PROFILE: 'finai_profile',
  ACCOUNTS: 'finai_accounts',
  TRANSACTIONS: 'finai_transactions',
  GOALS: 'finai_goals',
  INSIGHTS: 'finai_insights',
  CHALLENGES: 'finai_challenges',
  CHAT: 'finai_chat_messages',
};

// Seed Data
const DEFAULT_PROFILE: Profile = {
  id: 'user_dev_123',
  fullName: 'Alex Silva',
  profileType: 'student',
  points: 450,
  streakDays: 5,
  monthlyLimitTransactions: 100,
  isPremium: false,
};

const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc_1', name: 'Conta Principal (Sincronizada)', type: 'bank_account', balance: 1250.00, currency: 'BRL' },
  { id: 'acc_2', name: 'Carteira Dinheiro', type: 'cash', balance: 80.00, currency: 'BRL' },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  // Receitas do Estudante
  {
    id: 't_1',
    accountId: 'acc_1',
    categoryName: 'Bolsa de Estudos',
    type: 'income',
    amount: 700.00,
    description: 'Bolsa de Iniciação Científica CNPq',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
    isRecurring: true,
    isFixedCost: false,
    isCollegeRelated: true,
    collegeExpenseType: 'other',
    aiCategorized: true,
  },
  {
    id: 't_2',
    accountId: 'acc_1',
    categoryName: 'Estágio',
    type: 'income',
    amount: 900.00,
    description: 'Bolsa Estágio de Desenvolvimento',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: true,
    isFixedCost: false,
    isCollegeRelated: true,
    collegeExpenseType: 'other',
    aiCategorized: true,
  },
  // Despesas Estudante
  {
    id: 't_3',
    accountId: 'acc_1',
    categoryName: 'Alimentação',
    type: 'expense',
    amount: 3.00,
    description: 'Restaurante Universitário (RU)',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Ontem
    isRecurring: false,
    isFixedCost: false,
    isCollegeRelated: true,
    collegeExpenseType: 'food',
    aiCategorized: true,
  },
  {
    id: 't_4',
    accountId: 'acc_1',
    categoryName: 'Alimentação',
    type: 'expense',
    amount: 3.00,
    description: 'Restaurante Universitário (RU) - Jantar',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: false,
    isFixedCost: false,
    isCollegeRelated: true,
    collegeExpenseType: 'food',
    aiCategorized: true,
  },
  {
    id: 't_5',
    accountId: 'acc_1',
    categoryName: 'Transporte',
    type: 'expense',
    amount: 18.50,
    description: 'Corrida Uber Volta da Faculdade',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: false,
    isFixedCost: false,
    isCollegeRelated: true,
    collegeExpenseType: 'transport',
    aiCategorized: true,
  },
  {
    id: 't_6',
    accountId: 'acc_1',
    categoryName: 'Alimentação',
    type: 'expense',
    amount: 54.90,
    description: 'Almoço Delivery iFood',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: false,
    isFixedCost: false,
    isCollegeRelated: false,
    aiCategorized: true,
  },
  {
    id: 't_7',
    accountId: 'acc_1',
    categoryName: 'Educação',
    type: 'expense',
    amount: 12.00,
    description: 'Impressões e xerox apostila de Cálculo',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: false,
    isFixedCost: false,
    isCollegeRelated: true,
    collegeExpenseType: 'books',
    aiCategorized: true,
  },
  {
    id: 't_8',
    accountId: 'acc_1',
    categoryName: 'Lazer',
    type: 'expense',
    amount: 60.00,
    description: 'Cerveja e petiscos com amigos da turma',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: false,
    isFixedCost: false,
    isCollegeRelated: true,
    collegeExpenseType: 'parties',
    aiCategorized: true,
  },
  // Assinaturas Recorrentes
  {
    id: 't_9',
    accountId: 'acc_1',
    categoryName: 'Assinaturas',
    type: 'expense',
    amount: 34.90,
    description: 'Assinatura Spotify Premium',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: true,
    isFixedCost: true,
    isCollegeRelated: false,
    aiCategorized: true,
  },
  {
    id: 't_10',
    accountId: 'acc_1',
    categoryName: 'Assinaturas',
    type: 'expense',
    amount: 44.90,
    description: 'Assinatura Netflix Premium',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: true,
    isFixedCost: true,
    isCollegeRelated: false,
    aiCategorized: true,
  },
  {
    id: 't_11',
    accountId: 'acc_1',
    categoryName: 'Assinaturas',
    type: 'expense',
    amount: 18.90,
    description: 'Assinatura Prime Video',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    isRecurring: true,
    isFixedCost: true,
    isCollegeRelated: false,
    aiCategorized: true,
  },
];

const DEFAULT_GOALS: Goal[] = [
  {
    id: 'g_1',
    name: 'Notebook Dell Inspiron',
    targetAmount: 3000.00,
    currentAmount: 1200.00,
    targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 meses à frente
    term: 'short',
    category: 'electronics',
    isCompleted: false,
    aiInsights: 'Se economizar mais R$ 8 por dia, atingirá sua meta 1 mês antes.',
  },
  {
    id: 'g_2',
    name: 'Reserva de Emergência Universitária',
    targetAmount: 1500.00,
    currentAmount: 300.00,
    targetDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 8 meses à frente
    term: 'medium',
    category: 'emergency_fund',
    isCompleted: false,
    aiInsights: 'Excelente meta para evitar juros do cheque especial ao atrasar bolsas.',
  },
];

const DEFAULT_INSIGHTS: Insight[] = [
  {
    id: 'in_1',
    title: 'Detector de Delivery',
    description: 'Você gastou R$ 420 com delivery (iFood/Uber Eats) este mês. Que tal cozinhar em casa aos fins de semana?',
    impactAmount: 120.00,
    category: 'waste',
    dismissed: false,
    actionTaken: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'in_2',
    title: 'Assinaturas Duplicadas',
    description: 'Identificamos 3 assinaturas de streaming ativas (Netflix, Spotify, Prime Video) totalizando R$ 98,70/mês. Vale rever se usa todas!',
    impactAmount: 34.90,
    category: 'alert',
    dismissed: false,
    actionTaken: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'in_3',
    title: 'Aumento em Transporte',
    description: 'Seu gasto com transporte de aplicativos aumentou 22% esta semana em relação à média do mês anterior.',
    category: 'trend',
    dismissed: false,
    actionTaken: false,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'ch_1',
    title: 'Semana do RU',
    description: 'Almoce no Restaurante Universitário de segunda a sexta para economizar com iFood.',
    targetSavings: 50.00,
    pointsReward: 200,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
  },
  {
    id: 'ch_2',
    title: 'Desafio Sem Delivery',
    description: 'Fique 7 dias consecutivos sem pedir comida por aplicativo.',
    targetSavings: 80.00,
    pointsReward: 350,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
  },
];

const DEFAULT_CHAT: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'assistant',
    content: 'Olá! Sou o FinAI, seu copiloto financeiro inteligente. Pergunte-me qualquer coisa sobre suas contas, se pode fazer uma compra ou como acelerar suas metas!',
    createdAt: new Date().toISOString(),
  },
];

import { auth } from './auth';

export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

// Helper para ler/escrever no LocalStorage com suporte a Multi-tenant por usuário
const getScopedKey = (key: string): string => {
  const session = auth.getSession();
  const uid = session ? session.id : 'guest';
  return `${key}_${uid}`;
};

const getStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const scopedKey = getScopedKey(key);
    const item = window.localStorage.getItem(scopedKey);
    if (item) return JSON.parse(item);

    // Fallback se houver dados na chave antiga
    const legacyItem = window.localStorage.getItem(key);
    return legacyItem ? JSON.parse(legacyItem) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

const setStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    const scopedKey = getScopedKey(key);
    window.localStorage.setItem(scopedKey, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao gravar chave ${key} no localStorage`, error);
  }
};

// Funções da Base de Dados Híbrida
export const db = {
  // Reset/Inicializar com base no perfil escolhido
  resetData: (profileType: ProfileType = 'student') => {
    const profile: Profile = {
      ...DEFAULT_PROFILE,
      profileType,
      fullName: profileType === 'student' ? 'Alex Silva (Estudante)' : 'Clara Ramos (Freelancer)',
    };
    
    let transactions = [...DEFAULT_TRANSACTIONS];
    let goals = [...DEFAULT_GOALS];
    let accounts = [...DEFAULT_ACCOUNTS];
    let insights = [...DEFAULT_INSIGHTS];

    if (profileType === 'freelancer') {
      accounts = [
        { id: 'acc_free_1', name: 'Conta PJ Nubank', type: 'bank_account', balance: 5400.00, currency: 'BRL' },
        { id: 'acc_free_2', name: 'Conta Corrente PF', type: 'bank_account', balance: 1500.00, currency: 'BRL' },
      ];
      
      transactions = [
        {
          id: 'tf_1',
          accountId: 'acc_free_1',
          categoryName: 'Freelance Faturamento',
          type: 'income',
          amount: 4500.00,
          description: 'Criação de Web App E-commerce Cliente X',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isRecurring: false,
          isFixedCost: false,
          isCollegeRelated: false,
          clientName: 'Loja Variedades S.A.',
          aiCategorized: true,
        },
        {
          id: 'tf_2',
          accountId: 'acc_free_1',
          categoryName: 'Freelance Faturamento',
          type: 'income',
          amount: 2500.00,
          description: 'Manutenção Mensal API Cliente Y',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          isRecurring: true,
          isFixedCost: false,
          isCollegeRelated: false,
          clientName: 'Imobiliária Lins',
          aiCategorized: true,
        },
        {
          id: 'tf_3',
          accountId: 'acc_free_2',
          categoryName: 'Retirada Pró-labore',
          type: 'income', // Receita na PF
          amount: 2500.00,
          description: 'Transferência Pró-Labore Alex PF',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          isRecurring: true,
          isFixedCost: false,
          isCollegeRelated: false,
          aiCategorized: true,
        },
        {
          id: 'tf_4',
          accountId: 'acc_free_1',
          categoryName: 'Retirada Pró-labore',
          type: 'expense', // Despesa na PJ
          amount: 2500.00,
          description: 'Transferência Pró-Labore Alex PF',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          isRecurring: true,
          isFixedCost: false,
          isCollegeRelated: false,
          aiCategorized: true,
        },
        {
          id: 'tf_5',
          accountId: 'acc_free_1',
          categoryName: 'Serviços de Nuvem',
          type: 'expense',
          amount: 145.00,
          description: 'Fatura AWS Hosting Serverless',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isRecurring: true,
          isFixedCost: true,
          isCollegeRelated: false,
          aiCategorized: true,
        },
        {
          id: 'tf_6',
          accountId: 'acc_free_1',
          categoryName: 'Assinaturas Softwares',
          type: 'expense',
          amount: 124.00,
          description: 'Assinatura Adobe Creative Suite',
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          isRecurring: true,
          isFixedCost: true,
          isCollegeRelated: false,
          aiCategorized: true,
        },
      ];

      goals = [
        {
          id: 'gf_1',
          name: 'Reserva de Emergência PJ (6 meses)',
          targetAmount: 15000.00,
          currentAmount: 4500.00,
          targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          term: 'medium',
          category: 'emergency_fund',
          isCompleted: false,
          aiInsights: 'Essencial para suportar meses de baixa demanda no segundo semestre.',
        },
      ];

      insights = [
        {
          id: 'inf_1',
          title: 'Previsão de Caixa PJ',
          description: 'Seu faturamento médio nos últimos 3 meses foi de R$ 7.000. Seus custos fixos estão em R$ 269. Retirada de pró-labore recomendada: R$ 3.500.',
          category: 'trend',
          dismissed: false,
          actionTaken: false,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    setStorage(KEYS.PROFILE, profile);
    setStorage(KEYS.ACCOUNTS, accounts);
    setStorage(KEYS.TRANSACTIONS, transactions);
    setStorage(KEYS.GOALS, goals);
    setStorage(KEYS.INSIGHTS, insights);
    setStorage(KEYS.CHALLENGES, DEFAULT_CHALLENGES);
    setStorage(KEYS.CHAT, DEFAULT_CHAT);
  },

  // Perfil
  getProfile: (): Profile => {
    const profile = getStorage(KEYS.PROFILE, DEFAULT_PROFILE);
    const session = auth.getSession();
    if (session) {
      return {
        ...profile,
        id: session.id,
        fullName: session.fullName || profile.fullName,
        profileType: session.profileType || profile.profileType,
        isPremium: session.isPremium !== undefined ? session.isPremium : profile.isPremium,
      };
    }
    return profile;
  },
  updateProfile: (updates: Partial<Profile>): Profile => {
    const current = db.getProfile();
    const updated = { ...current, ...updates };
    setStorage(KEYS.PROFILE, updated);
    return updated;
  },

  // Contas
  getAccounts: (): Account[] => {
    return getStorage(KEYS.ACCOUNTS, DEFAULT_ACCOUNTS);
  },
  updateAccountBalance: (id: string, amount: number): void => {
    const accounts = db.getAccounts();
    const index = accounts.findIndex(a => a.id === id);
    if (index !== -1) {
      accounts[index].balance = roundMoney(accounts[index].balance + amount);
      setStorage(KEYS.ACCOUNTS, accounts);
    }
  },

  // Transações
  getTransactions: (): Transaction[] => {
    // Retorna ordenado por data descendente
    return getStorage<Transaction[]>(KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'> & { date?: string }): Transaction => {
    const transactions = db.getTransactions();
    const profile = db.getProfile();
    
    // Validar limites do Freemium
    if (!profile.isPremium && transactions.length >= profile.monthlyLimitTransactions) {
      throw new Error('Você atingiu o limite de 100 lançamentos mensais do plano Gratuito. Faça upgrade para ter lançamentos ilimitados!');
    }

    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      date: tx.date || new Date().toISOString(),
    };
    transactions.push(newTx);
    setStorage(KEYS.TRANSACTIONS, transactions);

    // Atualiza saldo da conta correspondente
    const multiplier = newTx.type === 'income' ? 1 : -1;
    db.updateAccountBalance(newTx.accountId, newTx.amount * multiplier);

    return newTx;
  },
  deleteTransaction: (id: string): void => {
    const transactions = db.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      const tx = transactions[index];
      // Reverte saldo da conta
      const multiplier = tx.type === 'income' ? -1 : 1;
      db.updateAccountBalance(tx.accountId, tx.amount * multiplier);
      
      transactions.splice(index, 1);
      setStorage(KEYS.TRANSACTIONS, transactions);
    }
  },

  // Metas
  getGoals: (): Goal[] => {
    return getStorage(KEYS.GOALS, DEFAULT_GOALS);
  },
  addGoal: (goal: Omit<Goal, 'id' | 'isCompleted'>): Goal => {
    const goals = db.getGoals();
    const profile = db.getProfile();

    if (!profile.isPremium && goals.length >= 3) {
      throw new Error('Você atingiu o limite de 3 metas ativas do plano Gratuito. Faça upgrade para ter metas ilimitadas!');
    }

    const newGoal: Goal = {
      ...goal,
      id: 'g_' + Math.random().toString(36).substr(2, 9),
      isCompleted: goal.currentAmount >= goal.targetAmount,
    };
    goals.push(newGoal);
    setStorage(KEYS.GOALS, goals);
    return newGoal;
  },
  updateGoal: (id: string, currentAmount: number): Goal => {
    const goals = db.getGoals();
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Meta não encontrada');
    
    goals[index].currentAmount = currentAmount;
    goals[index].isCompleted = currentAmount >= goals[index].targetAmount;
    
    // IA re-calcula conselhos rápidos
    if (!goals[index].isCompleted) {
      const targetDate = new Date(goals[index].targetDate);
      const diffTime = targetDate.getTime() - Date.now();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const remainingAmount = goals[index].targetAmount - currentAmount;
      if (diffDays > 0) {
        const requiredPerDay = remainingAmount / diffDays;
        goals[index].aiInsights = `Faltam R$ ${remainingAmount.toFixed(2)}. Você precisa economizar cerca de R$ ${requiredPerDay.toFixed(2)} por dia até o prazo final.`;
      }
    } else {
      goals[index].aiInsights = 'Meta concluída! Parabéns pela sua dedicação! 🚀';
    }

    setStorage(KEYS.GOALS, goals);
    return goals[index];
  },
  deleteGoal: (id: string): void => {
    const goals = db.getGoals();
    const filtered = goals.filter(g => g.id !== id);
    setStorage(KEYS.GOALS, filtered);
  },

  // Insights
  getInsights: (): Insight[] => {
    return getStorage<Insight[]>(KEYS.INSIGHTS, DEFAULT_INSIGHTS).filter(i => !i.dismissed);
  },
  dismissInsight: (id: string): void => {
    const insights = getStorage<Insight[]>(KEYS.INSIGHTS, DEFAULT_INSIGHTS);
    const index = insights.findIndex(i => i.id === id);
    if (index !== -1) {
      insights[index].dismissed = true;
      setStorage(KEYS.INSIGHTS, insights);
    }
  },

  // Desafios
  getChallenges: (): Challenge[] => {
    return getStorage(KEYS.CHALLENGES, DEFAULT_CHALLENGES);
  },
  completeChallenge: (id: string): Challenge => {
    const challenges = db.getChallenges();
    const index = challenges.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Desafio não encontrado');
    
    challenges[index].status = 'completed';
    setStorage(KEYS.CHALLENGES, challenges);

    // Incrementa pontos do usuário
    const reward = challenges[index].pointsReward;
    db.updateProfile({ points: db.getProfile().points + reward });

    return challenges[index];
  },

  // Chat
  getChatMessages: (): ChatMessage[] => {
    return getStorage(KEYS.CHAT, DEFAULT_CHAT);
  },
  addChatMessage: (sender: 'user' | 'assistant', content: string): ChatMessage => {
    const messages = db.getChatMessages();
    const newMsg: ChatMessage = {
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      sender,
      content,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMsg);
    setStorage(KEYS.CHAT, messages);
    return newMsg;
  },
  clearChat: (): void => {
    setStorage(KEYS.CHAT, DEFAULT_CHAT);
  }
};
