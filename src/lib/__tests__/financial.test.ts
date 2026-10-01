import { roundMoney, formatBRL, db } from '../db';
import { auth } from '../auth';
import { ai } from '../ai';

// Test Suite de Validação Financeira e Regras de Negócio do FinAI

async function runTests() {
  console.log('🧪 Iniciando Suíte de Testes Automatizados do FinAI...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ PASSED: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      failed++;
    }
  }

  // 1. Teste de Precisão Monetária (Ponto Flutuante)
  console.log('--- 1. Arredondamento Monetário e Formatação ---');
  assert(roundMoney(10.0000001) === 10.00, 'Arredonda centavos para duas casas decimais');
  assert(roundMoney(0.1 + 0.2) === 0.30, 'Evita erros clássicos de floating point (0.1 + 0.2)');
  assert(formatBRL(1250.50).includes('1.250,50'), 'Formata moeda no padrão brasileiro BRL');

  // 2. Teste de Autenticação
  console.log('\n--- 2. Autenticação e Sessão ---');
  const regRes = auth.register('Test User', 'test@finai.app', 'senha123');
  assert(regRes.success === true && regRes.user !== undefined, 'Registra novo usuário com sucesso');

  const loginRes = auth.login('test@finai.app', 'senha123');
  assert(loginRes.success === true, 'Realiza login com credenciais válidas');

  const invalidLogin = auth.login('test@finai.app', 'senha_errada');
  assert(invalidLogin.success === false, 'Rejeita login com senha incorreta');

  // 3. Teste do Copiloto IA (Regras Financeiras)
  console.log('\n--- 3. Inteligência Artificial Copiloto ---');
  const copilotRes = await ai.askCopilot('Posso gastar R$ 50?');
  assert(typeof copilotRes.answer === 'string' && copilotRes.answer.length > 0, 'IA gera resposta contextualizada para simulação de compra');

  // Summary
  console.log(`\n========================================`);
  console.log(`📊 Resultado dos Testes: ${passed} passaram, ${failed} falharam.`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Erro na execução dos testes:', err);
  process.exit(1);
});
