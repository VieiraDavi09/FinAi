'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useApp } from '@/providers';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Trash2,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  User2,
  DollarSign,
  LogOut
} from 'lucide-react';

export default function Configuracoes() {
  const router = useRouter();
  const { profile, authUser, setProfileType, togglePremium, logoutUser, refreshData } = useApp();

  const [activeTab, setActiveTab] = useState<'perfil' | 'plano' | 'seguranca' | 'notificacoes'>('perfil');

  // Form de Perfil
  const [name, setName] = useState(profile.fullName || '');
  const [email, setEmail] = useState(authUser?.email || 'usuario@finai.app');
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Form de Segurança
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [secMsg, setSecMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Preferências
  const [currency, setCurrency] = useState('BRL');
  const [notifications, setNotifications] = useState({
    wasteAlerts: true,
    weeklyReport: true,
    goalMilestones: true,
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    auth.updateUser({ fullName: name.trim() });
    setProfileMsg('Perfil atualizado com sucesso!');
    refreshData();
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecMsg(null);

    const res = auth.changePassword(oldPassword, newPassword);
    if (!res.success) {
      setSecMsg({ type: 'error', text: res.error || 'Erro ao alterar senha.' });
    } else {
      setSecMsg({ type: 'success', text: 'Senha alterada com sucesso!' });
      setOldPassword('');
      setNewPassword('');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('ATENÇÃO: Deseja realmente excluir sua conta? Todos os seus dados financeiros serão permanentemente removidos.')) {
      auth.deleteAccount();
      logoutUser();
      router.push('/');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#02040a]">
      <Header title="Configurações & Perfil" />

      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-6 max-w-[1100px] w-full mx-auto animate-slide-up">
        
        {/* User Badge Banner */}
        <div className="p-6 rounded-2xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/10">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">{profile.fullName}</span>
              <span className="text-xs text-muted-foreground">{email}</span>
              <span className="text-[10px] px-2 py-0.5 mt-1 rounded-full font-bold uppercase tracking-wider bg-white/5 text-emerald-400 w-fit">
                Modo {profile.profileType === 'student' ? 'Estudante' : profile.profileType === 'freelancer' ? 'Freelancer' : 'Padrão'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logoutUser();
                router.push('/login');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="flex border-b border-white/5 gap-2 overflow-x-auto custom-scrollbar">
          {[
            { id: 'perfil', label: 'Meu Perfil', icon: User },
            { id: 'plano', label: 'Plano & Cobrança', icon: CreditCard },
            { id: 'seguranca', label: 'Segurança', icon: Shield },
            { id: 'notificacoes', label: 'Notificações', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  active
                    ? 'border-emerald-500 text-emerald-400 bg-white/5 rounded-t-xl'
                    : 'border-transparent text-muted-foreground hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo da Aba Perfil */}
        {activeTab === 'perfil' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl glass-card flex flex-col gap-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Dados Pessoais</h3>

              {profileMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-fade-in flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{profileMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#02040a] border border-border/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">E-mail</label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2.5 text-muted-foreground cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-2">Modo de Uso do FinAI</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setProfileType('student')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        profile.profileType === 'student'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-white/5 border-white/5 text-muted-foreground hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                      <span>Estudante</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileType('freelancer')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        profile.profileType === 'freelancer'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-white/5 border-white/5 text-muted-foreground hover:text-white'
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />
                      <span>Freelancer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileType('standard')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        profile.profileType === 'standard'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold'
                          : 'bg-white/5 border-white/5 text-muted-foreground hover:text-white'
                      }`}
                    >
                      <User2 className="w-5 h-5" />
                      <span>Padrão</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Moeda de Exibição</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#02040a] border border-border/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="BRL">Real Brasileiro (R$ - BRL)</option>
                    <option value="USD">Dólar Americano ($ - USD)</option>
                    <option value="EUR">Euro (€ - EUR)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all w-fit mt-2"
                >
                  Salvar Alterações
                </button>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-4 border-rose-500/20">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Zona de Perigo
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A exclusão da sua conta apaga todo o seu histórico de lançamentos, metas e conquistas acumuladas.
                </p>
              </div>

              <button
                onClick={handleDeleteAccount}
                className="py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir Minha Conta</span>
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba Plano */}
        {activeTab === 'plano' && (
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-bold">Plano Atual</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-white">
                    {profile.isPremium ? 'FinAI Premium (Ilimitado)' : 'Plano Gratuito'}
                  </span>
                  {profile.isPremium && (
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-black uppercase">
                      Ativo
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={togglePremium}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  profile.isPremium
                    ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{profile.isPremium ? 'Simular Alteração de Plano' : 'Fazer Upgrade para Premium'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                <span className="text-muted-foreground">Lançamentos Mensais</span>
                <span className="text-lg font-bold text-white">
                  {profile.isPremium ? 'Ilimitados' : `${profile.monthlyLimitTransactions} / mês`}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                <span className="text-muted-foreground">Metas Ativas</span>
                <span className="text-lg font-bold text-white">
                  {profile.isPremium ? 'Ilimitadas' : 'Até 3 metas'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                <span className="text-muted-foreground">Mensagens Copiloto IA</span>
                <span className="text-lg font-bold text-white">
                  {profile.isPremium ? 'Ilimitadas' : '15 / mês'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba Segurança */}
        {activeTab === 'seguranca' && (
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-5 max-w-lg">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Alterar Senha</span>
            </h3>

            {secMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold animate-fade-in ${
                secMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
              }`}>
                {secMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1">Senha Atual</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-[#02040a] border border-border/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1">Nova Senha</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#02040a] border border-border/60 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all w-fit mt-2"
              >
                Atualizar Senha
              </button>
            </form>
          </div>
        )}

        {/* Conteúdo da Aba Notificações */}
        {activeTab === 'notificacoes' && (
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-5 max-w-lg">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Preferências de Notificação</span>
            </h3>

            <div className="flex flex-col gap-4 text-xs">
              {[
                { key: 'wasteAlerts', title: 'Alertas de Desperdício', desc: 'Notificar quando o gasto com delivery ou assinaturas subir' },
                { key: 'weeklyReport', title: 'Relatório Semanal de Economia', desc: 'Resumo por e-mail todo domingo com balanço da semana' },
                { key: 'goalMilestones', title: 'Marcos do Cofrinho', desc: 'Notificar ao atingir 50%, 75% e 100% de uma meta' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={(notifications as any)[item.key]}
                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
