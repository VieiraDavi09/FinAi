'use strict';
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, Profile, Account, Transaction, Goal, Challenge, Insight, ChatMessage, ProfileType } from '@/lib/db';
import { auth, AuthUser } from '@/lib/auth';

interface AppContextType {
  profile: Profile;
  accounts: Account[];
  transactions: Transaction[];
  goals: Goal[];
  challenges: Challenge[];
  insights: Insight[];
  messages: ChatMessage[];
  // Auth
  isLoggedIn: boolean;
  authUser: AuthUser | null;
  loginUser: (email: string, password: string) => { success: boolean; error?: string };
  registerUser: (fullName: string, email: string, password: string) => { success: boolean; error?: string };
  socialLoginUser: (provider: 'google' | 'facebook' | 'github') => { success: boolean; user?: AuthUser };
  logoutUser: () => void;
  // Data
  refreshData: () => void;
  setProfileType: (type: ProfileType) => void;
  togglePremium: () => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'> & { date?: string }) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'isCompleted'>) => void;
  depositGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  dismissInsight: (id: string) => void;
  completeChallenge: (id: string) => void;
  addChatMessage: (sender: 'user' | 'assistant', content: string) => void;
  clearChat: () => void;
  resetAllData: (type?: ProfileType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Carrega os dados iniciais
  const refreshData = () => {
    const session = auth.getSession();
    setAuthUser(session);
    setProfile(db.getProfile());
    setAccounts(db.getAccounts());
    setTransactions(db.getTransactions());
    setGoals(db.getGoals());
    setChallenges(db.getChallenges());
    setInsights(db.getInsights());
    setMessages(db.getChatMessages());
  };

  useEffect(() => {
    // Inicializar dados se não houver perfil salvo
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('finai_profile');
      if (!stored) {
        db.resetData('student'); // Default inicial
      }
      refreshData();
    }
  }, []);

  const loginUser = (email: string, password: string) => {
    const res = auth.login(email, password);
    if (res.success && res.user) {
      setAuthUser(res.user);
      db.updateProfile({
        id: res.user.id,
        fullName: res.user.fullName,
        profileType: res.user.profileType,
      });
      refreshData();
    }
    return res;
  };

  const registerUser = (fullName: string, email: string, password: string) => {
    const res = auth.register(fullName, email, password);
    if (res.success && res.user) {
      setAuthUser(res.user);
      db.updateProfile({
        id: res.user.id,
        fullName: res.user.fullName,
        profileType: res.user.profileType,
      });
      refreshData();
    }
    return res;
  };

  const socialLoginUser = (provider: 'google' | 'facebook' | 'github') => {
    const p = provider === 'facebook' ? 'google' : provider;
    const res = auth.socialLogin(p);
    if (res.success && res.user) {
      setAuthUser(res.user);
      db.updateProfile({
        id: res.user.id,
        fullName: res.user.fullName,
        profileType: res.user.profileType,
      });
      refreshData();
    }
    return { success: true };
  };

  const logoutUser = () => {
    auth.logout();
    setAuthUser(null);
    refreshData();
  };

  const setProfileType = (type: ProfileType) => {
    db.resetData(type); // Reseta com o seed correto para o perfil
    if (authUser) {
      auth.updateUser({ profileType: type });
    }
    refreshData();
  };

  const togglePremium = () => {
    if (!profile) return;
    const newStatus = !profile.isPremium;
    const updated = db.updateProfile({ isPremium: newStatus });
    if (authUser) {
      auth.updateUser({ isPremium: newStatus });
    }
    setProfile(updated);
  };

  const handleAddTransaction = (tx: Omit<Transaction, 'id' | 'date'> & { date?: string }) => {
    db.addTransaction(tx);
    refreshData();
  };

  const handleDeleteTransaction = (id: string) => {
    db.deleteTransaction(id);
    refreshData();
  };

  const handleAddGoal = (goal: Omit<Goal, 'id' | 'isCompleted'>) => {
    db.addGoal(goal);
    refreshData();
  };

  const handleDepositGoal = (id: string, amount: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    db.updateGoal(id, goal.currentAmount + amount);
    // Também lança uma transação de despesa do tipo "Meta/Cofrinho"
    if (accounts.length > 0) {
      db.addTransaction({
        accountId: accounts[0].id,
        categoryName: 'Cofrinho',
        type: 'expense',
        amount,
        description: `Depósito na meta: ${goal.name}`,
        isRecurring: false,
        isFixedCost: false,
        isCollegeRelated: profile?.profileType === 'student',
        collegeExpenseType: 'other',
        aiCategorized: true,
      });
    }
    refreshData();
  };

  const handleDeleteGoal = (id: string) => {
    db.deleteGoal(id);
    refreshData();
  };

  const handleDismissInsight = (id: string) => {
    db.dismissInsight(id);
    refreshData();
  };

  const handleCompleteChallenge = (id: string) => {
    db.completeChallenge(id);
    refreshData();
  };

  const handleAddChatMessage = (sender: 'user' | 'assistant', content: string) => {
    db.addChatMessage(sender, content);
    refreshData();
  };

  const handleClearChat = () => {
    db.clearChat();
    refreshData();
  };

  const handleResetAllData = (type?: ProfileType) => {
    db.resetData(type || profile?.profileType || 'student');
    refreshData();
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse text-sm">Carregando copiloto finAI...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        profile,
        accounts,
        transactions,
        goals,
        challenges,
        insights,
        messages,
        isLoggedIn: authUser !== null,
        authUser,
        loginUser,
        registerUser,
        socialLoginUser,
        logoutUser,
        refreshData,
        setProfileType,
        togglePremium,
        addTransaction: handleAddTransaction,
        deleteTransaction: handleDeleteTransaction,
        addGoal: handleAddGoal,
        depositGoal: handleDepositGoal,
        deleteGoal: handleDeleteGoal,
        dismissInsight: handleDismissInsight,
        completeChallenge: handleCompleteChallenge,
        addChatMessage: handleAddChatMessage,
        clearChat: handleClearChat,
        resetAllData: handleResetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de um AppProviders');
  }
  return context;
}
