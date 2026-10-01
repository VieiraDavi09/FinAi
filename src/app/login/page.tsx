'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

import { useApp } from '@/providers';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser, registerUser, socialLoginUser } = useApp();
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    searchParams.get('error') === 'auth_callback_failed'
      ? 'Falha na autenticação com Google. Tente novamente.'
      : null
  );

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      if (tab === 'login') {
        const res = loginUser(form.email, form.password);
        if (!res.success) {
          setErrorMsg(res.error || 'Erro ao realizar login.');
          setLoading(false);
          return;
        }
      } else {
        const res = registerUser(form.name, form.email, form.password);
        if (!res.success) {
          setErrorMsg(res.error || 'Erro ao criar conta.');
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }, 600);
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setErrorMsg(null);
    setSocialLoading(provider);

    // If Supabase is configured, use real OAuth flow
    if (isSupabaseConfigured && supabase && provider === 'google') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setSocialLoading(null);
        setErrorMsg('Falha ao iniciar login com Google. Tente novamente.');
      }
      // If no error, the browser is redirected to Google — no further action needed
      return;
    }

    // Fallback: demo / localStorage flow (used when Supabase is not configured)
    setTimeout(() => {
      socialLoginUser(provider);
      setSocialLoading(null);
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-violet-500/3 blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-violet-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-white">fin</span>
            <span className="text-emerald-400">AI</span>
          </span>
        </Link>

        {/* Card */}
        <div
          className="rounded-2xl p-8 relative"
          style={{
            background: 'rgba(10, 12, 22, 0.7)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 32px 80px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Success overlay */}
          {success && (
            <div className="absolute inset-0 rounded-2xl bg-[#02040a]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-bounce" />
              <p className="text-white font-semibold text-lg">
                {tab === 'login' ? 'Bem-vindo de volta!' : 'Conta criada!'}
              </p>
              <p className="text-muted-foreground text-sm">Redirecionando...</p>
            </div>
          )}

          {/* Tab switcher */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              id="tab-login"
              onClick={() => setTab('login')}
              className={`btn-interactive-ghost flex-1 py-2.5 rounded-lg text-sm font-semibold ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-violet-500/20 text-white border border-white/10 shadow-sm'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              id="tab-register"
              onClick={() => setTab('register')}
              className={`btn-interactive-ghost flex-1 py-2.5 rounded-lg text-sm font-semibold ${
                tab === 'register'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-violet-500/20 text-white border border-white/10 shadow-sm'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              Criar conta
            </button>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-white mb-1">
              {tab === 'login' ? 'Acesse sua conta' : 'Comece gratuitamente'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tab === 'login'
                ? 'Seu copiloto financeiro espera por você.'
                : 'Cadastre-se e transforme sua vida financeira.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium animate-fade-in">
              {errorMsg}
            </div>
          )}

          {/* Social buttons */}
          <div className="flex gap-3 mb-6">
            <button
              id="btn-google-auth"
              type="button"
              onClick={() => handleSocialAuth('google')}
              disabled={!!socialLoading || loading}
              className="btn-interactive-ghost flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: socialLoading === 'google' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)',
              }}
            >
              {socialLoading === 'google' ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              ) : (
                <FaGoogle className="w-4 h-4" />
              )}
              Google
            </button>
            <button
              id="btn-github-auth"
              type="button"
              onClick={() => handleSocialAuth('github')}
              disabled={!!socialLoading || loading}
              className="btn-interactive-ghost flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: socialLoading === 'github' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)',
              }}
            >
              {socialLoading === 'github' ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              ) : (
                <FaGithub className="w-4 h-4" />
              )}
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === 'register' && (
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors duration-200" />
                <input
                  id="input-name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-muted-foreground/60 outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(16,185,129,0.4)'; e.currentTarget.style.background = 'rgba(16,185,129,0.04)'; }}
                  onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors duration-200" />
              <input
                id="input-email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-muted-foreground/60 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(16,185,129,0.4)'; e.currentTarget.style.background = 'rgba(16,185,129,0.04)'; }}
                onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-400 transition-colors duration-200" />
              <input
                id="input-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={tab === 'register' ? 'Crie uma senha forte' : 'Sua senha'}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder:text-muted-foreground/60 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(16,185,129,0.4)'; e.currentTarget.style.background = 'rgba(16,185,129,0.04)'; }}
                onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              />
              <button
                type="button"
                id="btn-toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {tab === 'login' && (
              <div className="flex justify-end -mt-1">
                <a href="#" className="text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors duration-200">
                  Esqueceu a senha?
                </a>
              </div>
            )}

            {tab === 'register' && (
              <p className="text-[11px] text-muted-foreground leading-relaxed -mt-1">
                Ao criar uma conta, você concorda com nossos{' '}
                <a href="#" className="text-emerald-400/80 hover:text-emerald-400 underline underline-offset-2">Termos de Uso</a>
                {' '}e{' '}
                <a href="#" className="text-emerald-400/80 hover:text-emerald-400 underline underline-offset-2">Política de Privacidade</a>.
              </p>
            )}

            <button
              id="btn-submit-auth"
              type="submit"
              disabled={loading || !!socialLoading}
              className="btn-interactive relative w-full py-3.5 rounded-xl text-sm font-bold text-black flex items-center justify-center gap-2 overflow-hidden group"
              style={{
                background: loading
                  ? 'rgba(16,185,129,0.5)'
                  : 'linear-gradient(135deg, #10b981 0%, #6d28d9 100%)',
                boxShadow: '0 8px 32px -4px rgba(16,185,129,0.4)',
              }}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>{tab === 'login' ? 'Entrar na conta' : 'Criar conta grátis'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {tab === 'login' ? (
              <>
                Não tem conta?{' '}
                <button onClick={() => setTab('register')} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200">
                  Cadastre-se grátis
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button onClick={() => setTab('login')} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200">
                  Entrar
                </button>
              </>
            )}
          </p>
        </div>

        {/* Bottom note */}
        <p className="mt-6 text-center text-[11px] text-muted-foreground/50">
          🔒 Seus dados são protegidos com criptografia de ponta a ponta
        </p>
      </div>
    </div>
  );
}
