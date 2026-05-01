-- ============================================================
-- SISTEMA DE GESTIÓN ADMINISTRATIVA - SCHEMA COMPLETO
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- USUARIOS
create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    password_hash text not null,
    full_name text not null,
    role text check (role in ('alumno', 'secretaria', 'admin')) not null,
    student_code text,
    is_active boolean default true,
    created_at timestamptz default now()
);

-- CONSULTAS
create table if not exists consultations (
    id uuid primary key default gen_random_uuid(),
    code text unique not null,
    user_id uuid references users(id) on delete cascade,
    category text check (category in ('academico', 'financiero', 'infraestructura', 'sistemas')) not null,
    title text not null,
    description text not null,
    priority text check (priority in ('alta', 'media', 'baja')) not null,
    status text check (status in ('pendiente', 'en_proceso', 'resuelto')) default 'pendiente',
    assigned_to uuid references users(id),
    response text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- HISTORIAL DE ESTADOS
create table if not exists status_history (
    id uuid primary key default gen_random_uuid(),
    consultation_id uuid references consultations(id) on delete cascade,
    changed_by uuid references users(id),
    old_status text,
    new_status text not null,
    comment text,
    created_at timestamptz default now()
);

-- KMS: BASE DE CONOCIMIENTOS
create table if not exists kms_articles (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    content text not null,
    category text check (category in ('academico', 'financiero', 'infraestructura', 'sistemas')) not null,
    keywords text[] not null default '{}',
    is_published boolean default true,
    created_by uuid references users(id),
    view_count int default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- ÍNDICES
create index if not exists idx_users_email on users(email);
create index if not exists idx_consultations_user on consultations(user_id);
create index if not exists idx_consultations_status on consultations(status);
create index if not exists idx_consultations_code on consultations(code);
create index if not exists idx_status_history_consultation on status_history(consultation_id);
create index if not exists idx_kms_keywords on kms_articles using gin(keywords);
create index if not exists idx_kms_category on kms_articles(category);
