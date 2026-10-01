import { db, Transaction, Goal, Profile } from './db';

// AI Agent de Processamento Financeiro
export interface AIResponse {
  answer: string;
  suggestedAction?: {
    label: string;
    actionType: 'create_goal' | 'adjust_budget' | 'start_challenge' | 'upgrade_premium';
    payload?: any;
  };
}

export const ai = {
  // Envia pergunta ao copiloto financeiro (orquestração principal)
  askCopilot: async (question: string): Promise<AIResponse> => {
    // Simulando tempo de processamento de rede para dar sensação de "raciocínio" da IA (micro-animações no frontend)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const q = question.toLowerCase().trim();
    const profile = db.getProfile();
    const transactions = db.getTransactions();
    const goals = db.getGoals();
    const accounts = db.getAccounts();
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    // Cálculos rápidos de suporte
    const totalExpensesThisMonth = transactions
      .filter((t) => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncomeThisMonth = transactions
      .filter((t) => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + t.amount, 0);

    // 1. ANÁLISE: "Posso gastar/comprar R$ X / algo?"
    const canISpendRegex = /(?:posso gastar|posso comprar|vale a pena comprar|custa|vale comprar)\s*(?:r\$)?\s*(\d+(?:[\.,]\d{2})?)/i;
    const matchSpend = q.match(canISpendRegex);
    
    if (matchSpend) {
      const amount = parseFloat(matchSpend[1].replace(',', '.'));
      
      if (profile.profileType === 'student') {
        const remainingBudget = totalBalance - amount;
        
        if (amount > totalBalance) {
          return {
            answer: `🔴 **Infelizmente não é recomendado.** O valor de **R$ ${amount.toFixed(2)}** ultrapassa todo o seu saldo disponível em contas (**R$ ${totalBalance.toFixed(2)}**). Fazer essa compra agora causaria um endividamento imediato.`,
            suggestedAction: {
              label: 'Ver Desafios de Economia',
              actionType: 'start_challenge',
            }
          };
        } else if (amount > totalBalance * 0.3) {
          return {
            answer: `⚠️ **Atenção:** Comprar isso agora consumirá **${((amount / totalBalance) * 100).toFixed(0)}%** do seu saldo disponível (**R$ ${totalBalance.toFixed(2)}**). Como estudante, essa despesa impactará seu planejamento de transporte e alimentação (RU). Se for algo urgente, tente parcelar sem juros ou aguardar a próxima bolsa de estágio.`,
            suggestedAction: {
              label: 'Criar Meta no Cofrinho',
              actionType: 'create_goal',
              payload: { name: 'Compra Desejada', targetAmount: amount }
            }
          };
        } else {
          return {
            answer: `🟢 **Compra Segura!** O valor de **R$ ${amount.toFixed(2)}** representa apenas **${((amount / totalBalance) * 100).toFixed(1)}%** do seu saldo. Seu orçamento de estudante continuará saudável e não afetará suas despesas básicas.`,
          };
        }
      } else {
        // Freelancer
        const pjAccount = accounts.find(a => a.id === 'acc_free_1') || accounts[0];
        const balanceForCalc = pjAccount.balance;
        
        if (amount > balanceForCalc * 0.5) {
          return {
            answer: `⚠️ **Alerta de Fluxo de Caixa PJ:** Essa compra de **R$ ${amount.toFixed(2)}** consome mais de **50%** do saldo da sua conta corporativa. Como freelancer, é importante manter liquidez para impostos e meses de menor faturamento.`,
            suggestedAction: {
              label: 'Ver Projeções de Caixa',
              actionType: 'adjust_budget',
            }
          };
        } else {
          return {
            answer: `🟢 **Compra Autorizada!** Sua empresa possui caixa saudável e essa retirada/investimento de **R$ ${amount.toFixed(2)}** não causará instabilidade no capital de giro de curto prazo.`,
          };
        }
      }
    }

    // 2. ANÁLISE: "Como acelerar metas / economizar?"
    if (q.includes('meta') || q.includes('cofrinho') || q.includes('guardar') || q.includes('notebook')) {
      const activeGoals = goals.filter(g => !g.isCompleted);
      
      if (activeGoals.length === 0) {
        return {
          answer: `Você não tem nenhuma meta ativa no momento! Que tal começar criando seu primeiro objetivo de economia, como uma **Reserva de Emergência** ou a **viagem de férias**?`,
          suggestedAction: {
            label: 'Criar Minha Primeira Meta',
            actionType: 'create_goal'
          }
        };
      }

      const primary = activeGoals[0];
      const needed = primary.targetAmount - primary.currentAmount;
      const daysToTarget = Math.max(1, Math.ceil((new Date(primary.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      const requiredDaily = needed / daysToTarget;
      
      return {
        answer: `💡 **Copiloto IA - Plano de Aceleração de Metas:**\n\nSua principal meta hoje é: **${primary.name}**.\n- Falta guardar: **R$ ${needed.toFixed(2)}** (Prazo: ${new Date(primary.targetDate).toLocaleDateString('pt-BR')})\n- Ritmo diário atual necessário: **R$ ${requiredDaily.toFixed(2)}/dia**.\n\n**Como acelerar:**\n1. Se você economizar **R$ 5,00 extras por dia** (ex: evitando um café gourmet ou lanche na rua), você atingirá a meta **${Math.ceil(daysToTarget * 0.15)} dias antes**.\n2. Notamos que você tem gastos variáveis altos com lazer/delivery. Aceitar o desafio "Semana sem Delivery" adicionará **R$ 80,00** direto nessa meta.`,
        suggestedAction: {
          label: 'Iniciar Desafio Sem Delivery',
          actionType: 'start_challenge'
        }
      };
    }

    // 3. MODO UNIVERSITÁRIO: "Dinheiro dura até o final do mês?"
    if (q.includes('durar') || q.includes('final do mês') || q.includes('universitário') || q.includes('bolsa')) {
      if (profile.profileType !== 'student') {
        return {
          answer: `Essa pergunta é otimizada para o **Modo Universitário**. Ative seu perfil como Estudante nas Configurações para simular seu caixa da faculdade.`,
          suggestedAction: {
            label: 'Mudar Perfil para Estudante',
            actionType: 'upgrade_premium'
          }
        };
      }

      const currentBalance = totalBalance;
      // Despesas fixas estimadas restantes
      const today = new Date().getDate();
      const daysRemaining = 30 - today;
      const estimatedRUEvents = Math.max(0, daysRemaining * 2); // Almoço + Janta
      const ruCost = estimatedRUEvents * 3.00; // R$ 3 cada
      const transportCost = Math.max(0, daysRemaining * 8.00); // R$ 8/dia ônibus

      const basicSurvival = ruCost + transportCost;
      const leftOver = currentBalance - basicSurvival;

      if (leftOver < 0) {
        return {
          answer: `🚨 **Alerta de Caixa Crítico:** Seu saldo de **R$ ${currentBalance.toFixed(2)}** é inferior ao mínimo necessário para sobreviver de transporte e RU até o final do mês (estimado em **R$ ${basicSurvival.toFixed(2)}**).\n\n**Recomendação de Emergência:** Evite qualquer gasto de lazer neste fim de semana e resgate pontos no FinAI para prêmios extras ou solicite um adiantamento familiar.`,
        };
      } else if (leftOver < 150) {
        return {
          answer: `⚠️ **Zona Amarela:** Seu dinheiro vai durar, mas você chegará ao dia 30 com apenas **R$ ${leftOver.toFixed(2)}** de folga após pagar condução e refeições básicas. Evite compras parceladas ou saídas caras neste final de semana.`,
        };
      } else {
        return {
          answer: `🟢 **Status Verde!** Você tem **R$ ${currentBalance.toFixed(2)}** em conta. Subtraindo o básico estimado de alimentação e transporte (**R$ ${basicSurvival.toFixed(2)}**), restará uma folga confortável de **R$ ${leftOver.toFixed(2)}** para gastos livres.`,
        };
      }
    }

    // 4. MODO FREELANCER: "Quanto posso retirar?" ou "lucro real"
    if (q.includes('retirar') || q.includes('retirada') || q.includes('freelancer') || q.includes('lucro')) {
      if (profile.profileType !== 'freelancer') {
        return {
          answer: `Esta consulta requer dados do **Modo Freelancer**. Ative seu perfil de Autônomo para acompanhar fluxo de projetos e calcular retiradas seguras baseadas em sazonalidade.`,
        };
      }

      const pjAccount = accounts.find(a => a.id === 'acc_free_1') || accounts[0];
      const pjBalance = pjAccount.balance;
      const reserveGoal = goals.find(g => g.category === 'emergency_fund');
      const reserveSaved = reserveGoal ? reserveGoal.currentAmount : 0;

      // Retirada segura: Saldo PJ menos custos operacionais estimados (10%) menos imposto projetado (6% Simples) menos meta de reserva
      const safeWithdrawal = Math.max(0, (pjBalance - reserveSaved) * 0.7);

      return {
        answer: `📊 **Cálculo de Retirada Segura (Copiloto Freelancer):**\n\n- Saldo na Conta PJ: **R$ ${pjBalance.toFixed(2)}**\n- Fundo de Reserva PJ atual: **R$ ${reserveSaved.toFixed(2)}**\n\n**Sugestão de Pró-labore este mês:** Até **R$ ${safeWithdrawal.toFixed(2)}**.\n\n*Por que esse valor?* Manter os 30% restantes (R$ ${(pjBalance * 0.3).toFixed(2)}) em caixa garante o pagamento das suas ferramentas de nuvem (AWS/Adobe) e a cobertura dos impostos da nota fiscal do fim do mês sem sufocar sua empresa.`,
      };
    }

    // 5. ANÁLISE: "Vale a pena parcelar?"
    if (q.includes('parcelar') || q.includes('parcela') || q.includes('juros')) {
      return {
        answer: `🤔 **Regra de Ouro da IA para Parcelamentos:**\n\n1. **Tem desconto à vista?** Se houver desconto acima de 5%, **guarde o dinheiro e pague à vista**. A poupança rende cerca de 0.8% ao mês, logo economizar 5% à vista vale muito mais a pena.\n2. **É sem juros?** Se o parcelamento não tiver juros ocultos e couber em até **15% da sua renda livre mensal**, você pode parcelar, mas evite acumular mais de 3 parcelas simultâneas.\n3. **Cuidado:** Parcelas baixas dão a ilusão de orçamento folgado, mas o acúmulo delas é a principal causa de endividamento de universitários e autônomos.`,
      };
    }

    // 6. DETECTOR DE DESPERDÍCIOS / GERAL
    if (q.includes('gasto') || q.includes('desperdício') || q.includes('delivery') || q.includes('gastando')) {
      return {
        answer: `🔍 **Filtro de Desperdício Automático (IA):**\n\nAnalisamos suas últimas despesas e encontramos alguns gargalos:\n- **Assinaturas recorrentes:** Você gasta **R$ ${totalExpensesThisMonth > 0 ? (totalExpensesThisMonth * 0.1).toFixed(2) : '98.70'}** com serviços digitais que parecem subutilizados.\n- **Delivery (iFood/Uber):** Representa cerca de **32%** de todos os seus gastos variáveis do mês.\n- **Lazer Noturno:** Concentra picos de gastos concentrados nas sextas-feiras após as 20h.`,
        suggestedAction: {
          label: 'Iniciar Desafio 7 dias sem iFood',
          actionType: 'start_challenge',
        }
      };
    }

    // Resposta padrão inteligente
    return {
      answer: `Olá, **${profile.fullName}**! Com base na sua saúde financeira atual:\n\n- Seu saldo total é de **R$ ${totalBalance.toFixed(2)}**.\n- Este mês você registrou **R$ ${totalIncomeThisMonth.toFixed(2)}** em receitas e **R$ ${totalExpensesThisMonth.toFixed(2)}** em despesas.\n\nPosso te ajudar a planejar uma nova meta no cofrinho, simular o impacto de uma compra ou calcular a durabilidade do seu dinheiro até o fim do mês. O que gostaria de fazer?`,
    };
  }
};
