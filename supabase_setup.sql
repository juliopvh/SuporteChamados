-- ============================================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS NO SUPABASE (PostgreSQL)
-- Execute este script no SQL Editor do painel do seu Supabase
-- ============================================================================

-- 1. Criação da tabela de Usuários
CREATE TABLE IF NOT EXISTS public.usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criação da tabela de Chamados
CREATE TABLE IF NOT EXISTS public.chamados (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    prioridade TEXT DEFAULT 'Baixa' CHECK (prioridade IN ('Baixa', 'Média', 'Alta')),
    status TEXT DEFAULT 'Aberto' CHECK (status IN ('Aberto', 'Em Andamento', 'Concluído')),
    data DATE DEFAULT CURRENT_DATE,
    usuario_id BIGINT REFERENCES public.usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Índices para otimização de busca
CREATE INDEX IF NOT EXISTS idx_chamados_status ON public.chamados(status);
CREATE INDEX IF NOT EXISTS idx_chamados_usuario_id ON public.chamados(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);

-- 4. Habilitar Row Level Security (RLS) - Opcional se acessar apenas via Backend com Service Key,
-- mas recomendado liberar acesso caso utilize anon key com backend intermediário:
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chamados ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para API anônima/backend
DROP POLICY IF EXISTS "Permitir leitura pública de chamados" ON public.chamados;
CREATE POLICY "Permitir leitura pública de chamados" ON public.chamados FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção de chamados" ON public.chamados;
CREATE POLICY "Permitir inserção de chamados" ON public.chamados FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização de chamados" ON public.chamados;
CREATE POLICY "Permitir atualização de chamados" ON public.chamados FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir exclusão de chamados" ON public.chamados;
CREATE POLICY "Permitir exclusão de chamados" ON public.chamados FOR DELETE USING (true);

DROP POLICY IF EXISTS "Permitir gerenciamento de usuarios" ON public.usuarios;
CREATE POLICY "Permitir gerenciamento de usuarios" ON public.usuarios FOR ALL USING (true);
