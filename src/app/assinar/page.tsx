'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  CreditCard,
  Shield,
  Star,
  ArrowRight,
  Clock,
  Lock,
  ChevronDown,
} from 'lucide-react';

type BillingCycle = 'monthly' | 'annual';

const planFeatures = [
  { label: 'Lançamentos ilimitados', free: false, premium: true },
  { label: 'Chat IA sem limite de mensagens', free: false, premium: true },
  { label: 'Metas e cofrinhos ilimitados', free: false, premium: true },
  { label: 'Modo Freelancer com cálculo de impostos', free: true, premium: true },
  { label: 'Modo Universitário completo', free: true, premium: true },
  { label: 'Relatórios e gráficos avançados', free: false, premium: true },
  { label: 'Detecção de desperdícios IA', free: false, premium: true },
  { label: 'Suporte prioritário', free: false, premium: true },
  { label: 'Exportação de dados (CSV/PDF)', free: false, premium: true },
];

const faqs = [
  { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais.' },
  { q: 'Meus dados ficam seguros?', a: 'Absolutamente. Utilizamos criptografia de ponta a ponta e nunca compartilhamos seus dados.' },
  { q: 'Tem garantia de reembolso?', a: 'Sim, oferecemos 7 dias de garantia. Se não gostar, devolvemos 100% do valor.' },
  { q: 'Funciona para PJ e PF?', a: 'Sim! O modo Freelancer suporta cálculos tanto para Pessoa Física quanto Jurídica.' },
];

export default function AssinarPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<BillingCycle>('annual');
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const prices = {
    monthly: { brl: 'R$ 19,90', period: '/mês', total: null, saving: null },
    annual: { brl: 'R$ 16,58', period: '/mês', total: 'R$ 199,00/ano', saving: 'Economize R$ 39,80' },
  };

  const current = prices[billing];

  const handleCheckout = (planLabel: string) => {
    setLoading(planLabel);
    setTimeout(() => {
      setLoading(null);
      setSuccess(true);
      setTimeout(() => router.push('/'), 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#02040a] relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-600/12 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-emerald-500/8 blur-[120px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Success overlay */}
      {success && (
        <div className="fixed inset-0 bg-[#02040a]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Assinatura ativada!</h2>
          <p className="text-muted-foreground text-sm">Bem-vindo ao FinAI Premium ✨</p>
        </div>
      )}

      <div className="relative max-w-4xl mx-auto px-4 py-16 flex flex-col gap-16">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <Link href="/" className="flex items-center gap-2 mb-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-violet-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold"><span className="text-white">fin</span><span className="text-emerald-400">AI</span></span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-widest" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Sparkles className="w-3 h-3" />
            Plano Premium
          </div>
          <h1 className="text-4xl font-black text-white leading-tight">
            Controle total das suas<br />
            <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">finanças com IA</span>
          </h1>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Desbloqueie o potencial completo do FinAI e transforme sua relação com o dinheiro.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <button
              id="billing-monthly"
              onClick={() => setBilling('monthly')}
              className={`btn-interactive-ghost px-6 py-2.5 rounded-lg text-sm font-semibold ${
                billing === 'monthly'
                  ? 'bg-white/10 text-white shadow-sm border border-white/10'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              id="billing-annual"
              onClick={() => setBilling('annual')}
              className={`btn-interactive-ghost px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                billing === 'annual'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-violet-500/20 text-white shadow-sm border border-emerald-500/20'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              Anual
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-emerald-500 text-black">-17%</span>
            </button>
          </div>
          {billing === 'annual' && (
            <p className="text-xs text-emerald-400 font-medium animate-fade-in">
              🎉 {current.saving} com o plano anual
            </p>
          )}
        </div>

        {/* Main pricing card */}
        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(109,40,217,0.08) 100%)',
            border: '1px solid rgba(16,185,129,0.2)',
            boxShadow: '0 32px 80px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          {/* Glow top */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-24 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-10 items-start">
            {/* Left: price & CTA */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-5xl font-black text-white">{current.brl}</span>
                  <span className="text-muted-foreground pb-1.5 text-sm">{current.period}</span>
                </div>
                {current.total && (
                  <p className="text-xs text-muted-foreground">Cobrado como {current.total}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>7 dias de garantia de reembolso</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pagamento seguro via Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Cancele quando quiser</span>
                </div>
              </div>

              <button
                id="btn-checkout-premium"
                onClick={() => handleCheckout('premium')}
                disabled={!!loading}
                className="btn-interactive relative py-4 px-8 rounded-xl font-bold text-black flex items-center justify-center gap-2 overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #6d28d9 100%)',
                  boxShadow: '0 8px 32px -4px rgba(16,185,129,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
                }}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {loading === 'premium' ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4.5 h-4.5" />
                    <span>Assinar {billing === 'annual' ? 'Anual' : 'Mensal'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {/* Logos de pagamento */}
              <div className="flex items-center gap-3">
                {['Visa', 'MC', 'Pix', 'Boleto'].map((m) => (
                  <span
                    key={m}
                    className="text-[10px] font-bold px-2 py-1 rounded"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: features */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Tudo incluído</p>
              {planFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-white/80">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white text-center">Gratuito vs Premium</h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div
              className="grid grid-cols-3 text-xs font-bold uppercase tracking-widest px-5 py-3"
              style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
            >
              <span>Recurso</span>
              <span className="text-center">Grátis</span>
              <span className="text-center text-emerald-400">Premium</span>
            </div>
            {planFeatures.map((f, i) => (
              <div
                key={i}
                className="grid grid-cols-3 px-5 py-3.5 text-sm items-center"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                  borderBottom: i < planFeatures.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                }}
              >
                <span className="text-white/70">{f.label}</span>
                <div className="flex justify-center">
                  {f.free ? (
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <span className="w-4 h-4 flex items-center justify-center text-muted-foreground/30">—</span>
                  )}
                </div>
                <div className="flex justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white text-center">O que dizem nossos usuários</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Ana Lima', role: 'Freelancer', text: 'Finalmente entendo para onde vai meu dinheiro. O FinAI me ajudou a economizar R$ 800 no primeiro mês!' },
              { name: 'Carlos Souza', role: 'Estudante', text: 'O modo universitário é incrível. Consigo controlar mesada, bolsa e estágio tudo num lugar só.' },
              { name: 'Mariana Costa', role: 'Designer PJ', text: 'O cálculo de impostos PJ me salva toda vez que preciso precificar um projeto. Indispensável!' },
            ].map((t, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl flex flex-col gap-3"
                style={{
                  background: 'rgba(10,12,22,0.5)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-xs font-bold text-white">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white text-center">Perguntas frequentes</h2>
          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: openFaq === i ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
                  border: openFaq === i ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <button
                  id={`faq-${i}`}
              className={`btn-interactive-ghost w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-white text-left gap-4`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div
          className="rounded-2xl p-8 text-center flex flex-col items-center gap-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(109,40,217,0.10) 100%)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-16 bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-violet-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white mb-1">Pronto para transformar suas finanças?</h2>
            <p className="text-sm text-muted-foreground">Junte-se a milhares de pessoas que já usam o FinAI</p>
          </div>
          <button
            id="btn-checkout-final"
            onClick={() => handleCheckout('final')}
            disabled={!!loading}
            className="btn-interactive relative px-8 py-3.5 rounded-xl font-bold text-black flex items-center gap-2 overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #6d28d9 100%)',
              boxShadow: '0 8px 32px -4px rgba(16,185,129,0.4)',
            }}
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {loading === 'final' ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Assinar agora</span>
              </>
            )}
          </button>
          <p className="text-xs text-muted-foreground">Sem compromisso. Cancele quando quiser.</p>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-white transition-colors duration-200">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
