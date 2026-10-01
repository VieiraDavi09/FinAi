import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ai } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json(
        { error: 'A pergunta não pode estar vazia.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Se houver chave OPENAI no servidor, realiza a chamada oficial
    if (apiKey && apiKey !== 'mock' && !apiKey.includes('placeholder')) {
      try {
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Você é o FinAI, um copiloto financeiro inteligente e amigável voltado para estudantes, freelancers e autônomos. 
Sua proposta é entender o dinheiro do usuário e ajudá-lo a tomar decisões melhores.
Responda de forma direta, clara, educativa e encorajadora em português do Brasil.
Evite termos jargões de investimentos pesados ou bolsas de valores. Foque em controle de gastos, cofrinho/metas e organização.`,
            },
            {
              role: 'user',
              content: question.trim(),
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        const answerText = completion.choices[0]?.message?.content || 'Não foi possível obter uma resposta da IA no momento.';
        return NextResponse.json({ answer: answerText });
      } catch (err: any) {
        console.error('Erro na chamada OpenAI Server Side:', err?.message || err);
        // Fallback gracioso para o engine local
        const localResponse = await ai.askCopilot(question);
        return NextResponse.json(localResponse);
      }
    }

    // Fallback gracioso para o engine local (simulador inteligente)
    const localResponse = await ai.askCopilot(question);
    return NextResponse.json(localResponse);
  } catch (error: any) {
    console.error('Erro no endpoint /api/chat:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar requisição.' },
      { status: 500 }
    );
  }
}
