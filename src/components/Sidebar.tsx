'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/providers';
import Image from 'next/image';
import {
  LayoutDashboard,
  PiggyBank,
  MessageSquareCode,
  Trophy,
  GraduationCap,
  Briefcase,
  Sparkles,
  Flame,
  CreditCard,
  LogIn,
  LogOut,
  Crown,
  Settings,
} from 'lucide-react';

export default function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const { profile, isLoggedIn, logoutUser } = useApp();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/cofrinho', label: 'Cofrinho IA', icon: PiggyBank },
    { href: '/chat', label: 'Chat Copiloto', icon: MessageSquareCode, isAI: true },
    { href: '/desafios', label: 'Desafios', icon: Trophy },
    { href: '/universitario', label: 'Modo Universitário', icon: GraduationCap, badge: 'Estudante' },
    { href: '/freelancer', label: 'Modo Freelancer', icon: Briefcase, badge: 'Autônomo' },
    { href: '/configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-[#070913]/80 border-r border-border/40 backdrop-blur-md flex flex-col justify-between p-4 z-40">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 py-3 group">
          <div className="relative w-9 h-9 overflow-hidden rounded-xl bg-gradient-to-tr from-emerald-500 to-violet-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/img/logo.png"
              alt="finAI Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain rounded-lg bg-[#070913]"
              priority
            />
          </div>

          <div>
            <span className="font-bold text-white text-lg">fin</span>
            <span className="font-bold text-emerald-400 text-lg">AI</span>
          </div>
        </Link>

        {/* Gamification Stats */}
        <div className="px-2 py-3 rounded-xl glass-card flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span>Pontos FinAI</span>
            </span>
            <span className="font-bold text-white">{profile.points} xp</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>Ofensiva</span>
            </span>
            <span className="font-bold text-white">{profile.streakDays} dias</span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const isStudentRoute = link.href === '/universitario';
            const isFreelancerRoute = link.href === '/freelancer';

            // Destaques de badges baseados no perfil atual
            const isRecommended =
              (isStudentRoute && profile.profileType === 'student') ||
              (isFreelancerRoute && profile.profileType === 'freelancer');

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border-l-2 border-emerald-500'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${link.isAI ? 'text-violet-400' : ''} ${isActive && !link.isAI ? 'text-emerald-400' : ''}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isRecommended
                      ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
                      : 'bg-white/5 text-muted-foreground'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2">
        {/* Premium Banner or Status */}
        {!profile.isPremium ? (
          <Link
            href="/assinar"
            className="btn-interactive group p-3 rounded-xl flex flex-col gap-1 text-xs relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(109,40,217,0.25) 0%, rgba(16,185,129,0.15) 100%)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 4px 20px -4px rgba(109,40,217,0.2)',
            }}
          >
            {/* Animated shimmer */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div className="flex items-center gap-1.5 font-bold text-white relative">
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              <span>FinAI Premium</span>
              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/30 text-violet-300 font-black uppercase tracking-wider">
                Pro
              </span>
            </div>
            <p className="text-muted-foreground leading-tight relative">
              Desbloqueie tudo por R$ 19,90/mês
            </p>
          </Link>
        ) : (
          <div
            className="p-3 rounded-xl flex items-center justify-between text-xs"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              Assinatura Ativa
            </span>
            <span
              className="px-2 py-0.5 font-extrabold text-[9px] rounded-full uppercase tracking-wider text-black"
              style={{ background: 'linear-gradient(135deg, #10b981, #6d28d9)' }}
            >
              Premium
            </span>
          </div>
        )}

        {/* Action buttons — Login / Sair & Assinar */}
        <div className="flex gap-2">
          {isLoggedIn ? (
            <button
              id="sidebar-btn-logout"
              onClick={logoutUser}
              className="btn-interactive-danger flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          ) : (
            <Link
              id="sidebar-btn-login"
              href="/login"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <LogIn className="w-3.5 h-3.5" />
              Entrar
            </Link>
          )}

          <Link
            id="sidebar-btn-assinar"
            href="/assinar"
            className="btn-interactive flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #6d28d9 100%)',
              boxShadow: '0 4px 16px -4px rgba(16,185,129,0.4)',
              color: '#000',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 relative" />
            <span className="relative">Assinar</span>
          </Link>
        </div>

        {/* User Card */}
        <Link
          href="/configuracoes"
          className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-white/10 cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(109,40,217,0.2))',
              border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col overflow-hidden min-w-0">
            <span className="font-semibold text-xs text-white truncate">{profile.fullName}</span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {profile.profileType === 'student'
                ? 'Estudante'
                : profile.profileType === 'freelancer'
                ? 'Freelancer'
                : 'Padrão'}
            </span>
          </div>
          {profile.isPremium && (
            <div className="ml-auto flex-shrink-0">
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
