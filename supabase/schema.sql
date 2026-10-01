-- ==============================================================================
-- FINAI - BANCO DE DADOS POSTGRESQL + SUPABASE ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. TABELA DE PERFIS DE USUÁRIOS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  profile_type TEXT NOT NULL DEFAULT 'student' CHECK (profile_type IN ('student', 'freelancer', 'standard')),
  points INTEGER NOT NULL DEFAULT 450,
  streak_days INTEGER NOT NULL DEFAULT 5,
  monthly_limit_transactions INTEGER NOT NULL DEFAULT 100,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABELA DE CONTAS BANCÁRIAS / CARTEIRAS
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'bank_account',
  balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'BRL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABELA DE TRANSAÇÕES (RECEITAS E DESPESAS)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount >= 0),
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  is_fixed_cost BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Modo Universitário
  is_college_related BOOLEAN NOT NULL DEFAULT FALSE,
  college_expense_type TEXT CHECK (college_expense_type IN ('food', 'transport', 'books', 'tuition', 'parties', 'other')),
  
  -- Modo Freelancer / Autônomo
  client_name TEXT,
  freelance_project_id TEXT,
  
  -- IA Metadata
  ai_categorized BOOLEAN NOT NULL DEFAULT FALSE,
  ai_confidence NUMERIC(3, 2),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABELA DE METAS / COFRINHO IA
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(15, 2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (current_amount >= 0),
  target_date DATE NOT NULL,
  term TEXT NOT NULL CHECK (term IN ('short', 'medium', 'long')),
  category TEXT NOT NULL DEFAULT 'electronics',
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  ai_insights TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABELA DE INSIGHTS AUTOMÁTICOS
CREATE TABLE IF NOT EXISTS public.insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact_amount NUMERIC(15, 2),
  category TEXT NOT NULL CHECK (category IN ('waste', 'alert', 'trend', 'educational')),
  dismissed BOOLEAN NOT NULL DEFAULT FALSE,
  action_taken BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABELA DE DESAFIOS E GAMIFICAÇÃO
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_savings NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  points_reward INTEGER NOT NULL DEFAULT 100,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TABELA DE MENSAGENS E HISTÓRICO DA IA
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ATIVAÇÃO DE ROW LEVEL SECURITY (RLS) - SEGURANÇA MULTI-TENANT
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE ACESSO: PROFILES
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE ACESSO: ACCOUNTS
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuários só acessam suas próprias contas"
  ON public.accounts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE ACESSO: CATEGORIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuários acessam suas categorias ou públicas"
  ON public.categories FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE ACESSO: TRANSACTIONS
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuários só acessam suas próprias transações"
  ON public.transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE ACESSO: GOALS
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuários só acessam suas próprias metas"
  ON public.goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE ACESSO: INSIGHTS
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuários só acessam seus próprios insights"
  ON public.insights FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE ACESSO: CHALLENGES
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuários só acessam seus próprios desafios"
  ON public.challenges FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE ACESSO: CHAT MESSAGES
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuários só acessam seu próprio histórico de chat"
  ON public.chat_messages FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- TRIGGER PARA CRIAÇÃO AUTOMÁTICA DE PERFIL E CONTAS AO CADASTRAR
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, profile_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    NEW.email,
    'student'
  );

  INSERT INTO public.accounts (user_id, name, type, balance)
  VALUES (NEW.id, 'Conta Principal', 'bank_account', 0.00);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
