'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/providers';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Brain,
  PiggyBank,
  GraduationCap,
  Briefcase,
  TrendingUp,
  LineChart,
  ChevronRight,
  Star,
  Lock,
} from 'lucide-react';

export default function LandingPage() {
  const { isLoggedIn, profile } = useApp();

  const benefits = [
    {
      icon: Brain,
      title: 'Copiloto de IA Financeiro',
      description: 'Pergunte em linguagem natural: "Posso gastar R$ 200 este fim de semana?" e receba análises precisas baseadas na sua realidade.',
      color: 'from-violet-500/20 to-purple-500/20 text-violet-400',
    },
    {
      icon: PiggyBank,
      title: 'Cofrinho IA & Metas',
      description: 'Defina objetivos para seu notebook, viagem ou reserva. A IA calcula a economia diária exata e projeta a data de conclusão.',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    },
    {
      icon: GraduationCap,
      title: 'Modo Universitário',
      description: 'Ideal para quem concilia bolsa de estudos, estágio, RU e transporte. Previna rombos no orçamento de sobrevivência do campus.',
      color: 'from-sky-500/20 to-blue-500/20 text-sky-400',
    },
    {
      icon: Briefcase,
      title: 'Modo Freelancer & PJ',
      description: 'Separe conta PJ e PF, calcule provisão de impostos e descubra qual a retirada máxima segura de pró-labore este mês.',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    },
    {
      icon: Zap,
      title: 'Detector de Desperdício',
      description: 'Identifique assinaturas duplicadas, excessos em delivery e picos de consumo antes que afetem o seu saldo final.',
      color: 'from-rose-500/20 to-pink-500/20 text-rose-400',
    },
    {
      icon: ShieldCheck,
      title: 'Gamificação & Ofensiva',
      description: 'Ganhe pontos de XP ao economizar, conquiste medalhas e mantenha uma sequência diária de boa gestão financeira.',
      color: 'from-yellow-500/20 to-amber-500/20 text-yellow-400',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Cadastre-se Gratuitamente',
      description: 'Crie sua conta em segundos sem necessidade de cartão de crédito.',
    },
    {
      number: '02',
      title: 'Escolha seu Perfil',
      description: 'Selecione entre Universitário, Autônomo/Freelancer ou Padrão.',
    },
    {
      number: '03',
      title: 'Deixe a IA Analisar',
      description: 'Lance suas receitas e despesas por texto ou áudio em segundos.',
    },
    {
      number: '04',
      title: 'Economize & Alcance Metas',
      description: 'Receba alertas inteligentes e atinja seus objetivos com folga.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#02040a] text-foreground relative overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[160px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-30 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-tr from-emerald-500 to-violet-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/img/logo.png"
              alt="finAI Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain rounded-lg bg-[#070913]"
              priority
            />
          </div>
          <div>
            <span className="font-bold text-white text-xl">fin</span>
            <span className="font-bold text-emerald-400 text-xl">AI</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-muted-foreground">
          <a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
          <Link href="/precos" className="hover:text-white transition-colors">Planos</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <span>Ir para o Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
              >
                <span>Criar Conta</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24 px-6 max-w-5xl mx-auto text-center flex flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>O Copiloto Financeiro Inteligente de Próxima Geração</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight">
          Você realmente sabe para onde seu <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">
            dinheiro está indo?
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          O <strong className="text-white">finAI</strong> entende sua vida financeira, elimina o estresse das planilhas e ajuda você a economizar todos os dias com auxílio de inteligência artificial.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-sm transition-all duration-300 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 group hover:scale-[1.02]"
          >
            <span>{isLoggedIn ? "Acessar Meu Dashboard" : "Começar Gratuitamente"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/precos"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all text-center"
          >
            Ver Planos & Recursos
          </Link>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground/80 mt-4">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Sem cartão necessário</span>
          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-400" /> Dados Criptografados</span>
          <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 4.9/5 Avaliações</span>
        </div>
      </section>

      {/* Feature Preview Showcase Card */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 mb-24">
        <div className="p-2 sm:p-4 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="rounded-2xl bg-[#070913] p-6 sm:p-8 flex flex-col gap-6 border border-white/5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs text-muted-foreground ml-2 font-mono">app.finai.com/dashboard</span>
              </div>
              <span className="text-xs text-emerald-400 font-bold px-2.5 py-1 rounded-full bg-emerald-500/10">
                Copiloto Ativo • Modo Inteligente
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Saldo Disponível</span>
                <span className="text-2xl font-black text-white">R$ 1.330,00</span>
                <span className="text-[10px] text-emerald-400 font-medium">↑ +R$ 1.600 Entradas este mês</span>
              </div>
              <div className="p-4 rounded-xl bg-violet-600/10 border border-violet-500/20 flex flex-col gap-2">
                <span className="text-[10px] text-violet-300 uppercase font-bold flex items-center gap-1">
                  <Brain className="w-3 h-3" /> Resposta da IA
                </span>
                <p className="text-xs text-white/90 leading-normal">
                  "Você pode comprar o item de R$ 150. Restará R$ 1.180, suficiente para o RU e transporte até o fim do mês!"
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2">
                <span className="text-[10px] text-emerald-300 uppercase font-bold flex items-center gap-1">
                  <PiggyBank className="w-3 h-3" /> Meta Cofrinho
                </span>
                <span className="text-sm font-bold text-white">Notebook Faculdade</span>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-2/3"></div>
                </div>
                <span className="text-[10px] text-muted-foreground">R$ 1.200 de R$ 3.000 (40%)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="beneficios" className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest">Tudo o que você precisa</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Construído para a sua realidade</h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Seja você um estudante lidando com mesadas ou um freelancer administrando receitas de clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-card flex flex-col gap-4 hover:border-white/10 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/5">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <span className="text-xs text-violet-400 font-extrabold uppercase tracking-widest">Simples & Rápido</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Como o finAI Funciona</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-card flex flex-col gap-3 relative">
              <span className="text-3xl font-black text-emerald-400/40">{s.number}</span>
              <h3 className="text-sm font-bold text-white">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto border-t border-white/5">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <span className="text-xs text-yellow-400 font-extrabold uppercase tracking-widest">Depoimentos</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Aprovado por estudantes e autônomos</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: 'O finAI me impediu de estourar meu orçamento de transporte três meses seguidos.', name: 'Lucas Mendes', role: 'Estudante de Engenharia' },
            { quote: 'Com o Modo Freelancer consegui finalmente saber exatamente quanto tirar de pró-labore PJ.', name: 'Beatriz Rocha', role: 'Designer Autônoma' },
            { quote: 'Fazer lançamentos por mensagem de texto torna o controle financeiro um hábito sem esforço.', name: 'Gabriel Torres', role: 'Desenvolvedor' },
          ].map((t, idx) => (
            <div key={idx} className="p-5 rounded-2xl glass-card flex flex-col justify-between gap-4">
              <p className="text-xs text-white/80 leading-relaxed italic">"{t.quote}"</p>
              <div>
                <span className="text-xs font-bold text-white block">{t.name}</span>
                <span className="text-[10px] text-muted-foreground">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-violet-600/10 to-emerald-500/10 border border-emerald-500/20 flex flex-col items-center gap-6 relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Pronto para transformar sua vida financeira?
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Comece hoje mesmo gratuitamente e sinta a diferença no seu saldo no final do mês.
          </p>
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02]"
          >
            {isLoggedIn ? "Acessar Dashboard" : "Criar Minha Conta Grátis"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">fin<span className="text-emerald-400">AI</span></span>
          <span>© 2026 — Todos os direitos reservados.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/precos" className="hover:text-white transition-colors">Planos</Link>
          <Link href="/login" className="hover:text-white transition-colors">Login</Link>
          <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Termos</a>
        </div>
      </footer>
    </div>
  );
}
