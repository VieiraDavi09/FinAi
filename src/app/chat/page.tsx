'use strict';
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import { useApp } from '@/providers';
import { ai } from '@/lib/ai';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  Mic, 
  CornerDownLeft, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  User,
  ShieldAlert
} from 'lucide-react';

export default function Chat() {
  const { 
    profile, 
    messages, 
    addChatMessage, 
    clearChat 
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Mensagens enviadas nesta sessão (para controle do limite gratuito no LocalStorage)
  const [sessionMessageCount, setSessionMessageCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(window.localStorage.getItem('finai_chat_count') || '3');
    }
    return 3;
  });

  const incrementMessageCount = () => {
    const nextCount = sessionMessageCount + 1;
    setSessionMessageCount(nextCount);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('finai_chat_count', nextCount.toString());
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Verificar limite freemium (15 mensagens)
    if (!profile.isPremium && sessionMessageCount >= 15) {
      alert('Você atingiu o limite de 15 mensagens mensais do plano Gratuito. Ative a simulação Premium no topo da página para continuar!');
      return;
    }

    // Adiciona pergunta do usuário
    addChatMessage('user', textToSend);
    setInput('');
    setLoading(true);
    incrementMessageCount();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        addChatMessage('assistant', data.answer || 'Sem resposta disponível.');
      } else {
        const fallback = await ai.askCopilot(textToSend);
        addChatMessage('assistant', fallback.answer);
      }
    } catch (error) {
      const fallback = await ai.askCopilot(textToSend);
      addChatMessage('assistant', fallback.answer);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  // Sugestões de perguntas rápidas
  const suggestions = [
    { text: 'Estou gastando demais este mês?', label: 'Análise de Gastos' },
    { text: 'Posso gastar R$ 150 no fim de semana?', label: 'Simulador de Compra' },
    { text: 'Como posso atingir minha meta mais rápido?', label: 'Acelerar Cofrinho' },
    profile.profileType === 'freelancer' 
      ? { text: 'Quanto posso retirar de pró-labore PJ?', label: 'Retirada PJ' }
      : { text: 'Meu dinheiro dura até o fim do mês?', label: 'Duração de Caixa' }
  ];

  const freeRemaining = Math.max(0, 15 - sessionMessageCount);

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#02040a]">
      <Header title="Copiloto de IA" />

      {/* Chat Container */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden max-w-[1000px] w-full mx-auto p-4 sm:p-6">
        
        {/* Banner de Limite Freemium */}
        {!profile.isPremium && (
          <div className="mb-4 p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-between text-xs text-muted-foreground animate-fade-in shrink-0">
            <span className="flex items-center gap-1.5 text-violet-300">
              <ShieldAlert className="w-4 h-4 text-violet-400" />
              <span>Limite de Chat Ativo (Freemium)</span>
            </span>
            <span className="font-bold text-white bg-white/5 px-2 py-0.5 rounded">
              {freeRemaining} mensagens restantes
            </span>
          </div>
        )}

        {/* Mensagens Feed */}
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 mb-4 custom-scrollbar">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';

            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] animate-fade-in ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isBot 
                    ? 'bg-gradient-to-tr from-emerald-500 to-violet-500 text-white shadow shadow-emerald-500/10' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {isBot ? 'IA' : <User className="w-4.5 h-4.5" />}
                </div>

                {/* Caixa de Mensagem */}
                <div className={`flex flex-col gap-1 p-3.5 rounded-2xl ${
                  isBot 
                    ? 'bg-white/5 border border-white/5 text-muted-foreground' 
                    : 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-300'
                }`}>
                  {isBot && (
                    <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Copiloto FinAI</span>
                    </span>
                  )}
                  <p className="text-xs leading-relaxed whitespace-pre-wrap select-text">
                    {msg.content}
                  </p>
                  <span className="text-[8px] text-muted-foreground/60 self-end mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Bot Raciocinando (Typing Indicator) */}
          {loading && (
            <div className="flex gap-3 max-w-[80%] self-start animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-violet-500 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                IA
              </div>
              <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-white/5 border border-white/5 text-muted-foreground w-40">
                <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-violet-400 animate-spin" />
                  <span>Analisando Caixa...</span>
                </span>
                <div className="flex gap-1 py-2 justify-start items-center">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input e Sugestões */}
        <div className="shrink-0 flex flex-col gap-4">
          
          {/* Sugestões Rápidas (Mostra apenas se tiver poucas mensagens para não poluir) */}
          {messages.length <= 2 && !loading && (
            <div className="grid grid-cols-2 gap-2 text-left">
              {suggestions.map((s) => (
                <button
                  key={s.text}
                  onClick={() => handleSend(s.text)}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 text-left flex flex-col gap-1 group"
                >
                  <span className="text-[10px] font-bold text-violet-400 uppercase group-hover:text-emerald-400 transition-colors">
                    {s.label}
                  </span>
                  <span className="text-xs text-muted-foreground group-hover:text-white transition-colors truncate">
                    {s.text}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Caixa de Entrada */}
          <div className="relative rounded-2xl bg-[#070913]/60 border border-border/80 focus-within:border-emerald-500/60 p-2.5 flex items-center gap-2 backdrop-blur-md">
            <button 
              onClick={() => {
                if (confirm('Deseja limpar todo o histórico de conversas desta sessão?')) {
                  clearChat();
                }
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-rose-400 transition-colors"
              title="Limpar Conversa"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Pergunte ao seu copiloto financeiro (Ex: Vale parcelar meu notebook?)"
              className="flex-1 bg-transparent text-xs text-white border-0 focus:ring-0 outline-none resize-none max-h-20 py-2 custom-scrollbar placeholder:text-muted-foreground/60"
              rows={1}
            />

            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-emerald-500 disabled:bg-emerald-800/40 text-black disabled:text-muted-foreground transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
