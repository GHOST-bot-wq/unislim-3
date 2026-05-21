-- ====================================================================
-- UNISLIM DATABASE SCHEMA
-- Execute este script no SQL Editor do seu projeto Supabase.
-- ====================================================================

-- Habilitar a extensão UUID se não estiver ativa
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABELA PROFILES (Perfis de usuário)
-- ==========================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text,
  avatar_url text,
  age integer,
  height numeric(5,2),
  current_weight numeric(5,2),
  goal_weight numeric(5,2),
  objective text,
  theme text default 'calm',
  streak_days integer default 0
);

-- Ativar Row Level Security
alter table public.profiles enable row level security;

-- Criar Políticas RLS para Profiles
create policy "Users can view their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- ==========================================
-- 2. TABELA DAILY_LOGS (Progresso de hábitos diários)
-- ==========================================
create table if not exists public.daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at date default current_date not null,
  water_intake integer default 0,
  steps integer default 0,
  calories integer default 0,
  mood text,
  completed boolean default false,
  unique (user_id, created_at)
);

-- Ativar Row Level Security
alter table public.daily_logs enable row level security;

-- Criar Políticas RLS para Daily Logs
create policy "Users can view their own daily logs" 
  on public.daily_logs for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own daily logs" 
  on public.daily_logs for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own daily logs" 
  on public.daily_logs for update 
  using (auth.uid() = user_id);

-- ==========================================
-- 3. TABELA MEAL_SCANS (Scans de refeições via IA)
-- ==========================================
create table if not exists public.meal_scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  image_url text,
  calories integer not null,
  proteins integer default 0,
  carbs integer default 0,
  fats integer default 0,
  health_score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativar Row Level Security
alter table public.meal_scans enable row level security;

-- Criar Políticas RLS para Meal Scans
create policy "Users can view their own meal scans" 
  on public.meal_scans for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own meal scans" 
  on public.meal_scans for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own meal scans" 
  on public.meal_scans for update 
  using (auth.uid() = user_id);

-- ==========================================
-- 4. TABELA DIET_PLANS (Planos alimentares do usuário)
-- ==========================================
create table if not exists public.diet_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  breakfast jsonb,
  lunch jsonb,
  dinner jsonb,
  snacks jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativar Row Level Security
alter table public.diet_plans enable row level security;

-- Criar Políticas RLS para Diet Plans
create policy "Users can view their own diet plans" 
  on public.diet_plans for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own diet plans" 
  on public.diet_plans for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own diet plans" 
  on public.diet_plans for update 
  using (auth.uid() = user_id);

-- ====================================================================
-- TRIGGERS E FUNÇÕES DE AUTOMAÇÃO DE PERFIL
-- ====================================================================

-- Função que intercepta novos cadastros na auth.users e insere um profile correspondente
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    avatar_url, 
    age, 
    height, 
    current_weight, 
    goal_weight, 
    objective, 
    theme, 
    streak_days
  )
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    coalesce(new.raw_user_meta_data->>'avatar_url', ''), 
    coalesce((new.raw_user_meta_data->>'age')::integer, 25), 
    coalesce((new.raw_user_meta_data->>'height')::numeric(5,2), 1.75), 
    coalesce((new.raw_user_meta_data->>'current_weight')::numeric(5,2), 75.0), 
    coalesce((new.raw_user_meta_data->>'goal_weight')::numeric(5,2), 68.0), 
    coalesce(new.raw_user_meta_data->>'objective', 'lose_weight'), 
    'calm', 
    0
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger disparada após a criação do usuário
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ====================================================================
-- BUCKETS DE STORAGE (INSTRUÇÕES)
-- ====================================================================
-- Para configurar o armazenamento de imagens no Supabase, crie dois buckets públicos no console do Supabase:
-- 1. avatars (com acesso público e políticas de leitura livre e escrita para usuários autenticados)
-- 2. meals (com acesso público e políticas de leitura livre e escrita para usuários autenticados)
-- ====================================================================
