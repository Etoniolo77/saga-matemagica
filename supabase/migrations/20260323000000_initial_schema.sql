-- Esquema para Projeto Saga Matemágica - Nível Ouro
-- 1. Perfis de Usuário
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    display_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('parent', 'child')),
    parent_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Configurações do Aplicativo
CREATE TABLE app_configs (
    id BIGSERIAL PRIMARY KEY,
    parent_id UUID REFERENCES profiles(id),
    child_id UUID REFERENCES profiles(id),
    school_year INTEGER CHECK (school_year BETWEEN 1 AND 4),
    active_subjects TEXT[],
    reward_value_correct NUMERIC(10,2) DEFAULT 0.25,
    penalty_value_error NUMERIC(10,2) DEFAULT 0.00,
    daily_goal_points INTEGER DEFAULT 100,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Conteúdo Educacional
CREATE TABLE education_content (
    id BIGSERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    school_year INTEGER NOT NULL,
    topic TEXT,
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    bncc_code TEXT
);

-- 4. Progresso e Recompensas
CREATE TABLE user_progress (
    id BIGSERIAL PRIMARY KEY,
    child_id UUID REFERENCES profiles(id),
    content_id BIGSERIAL REFERENCES education_content(id),
    is_correct BOOLEAN NOT NULL,
    points_earned INTEGER NOT NULL,
    monetary_earned NUMERIC(10,2) NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas de RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Painel do Pai" ON app_configs FOR ALL USING (auth.uid() = parent_id);
CREATE POLICY "Visão da Criança" ON user_progress FOR ALL USING (auth.uid() = child_id);
