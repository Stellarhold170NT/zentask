# Database Schema: Zentask

This document defines the PostgreSQL schema for the Zentask application, designed to be implemented on Supabase. It supports multi-project management, dynamic columns with WIP limits, and AI-ready fields.

## 1. Profiles (Public User Data)
Mapped to Supabase Auth.

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
```

## 2. Projects
```sql
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;
```

## 3. Columns (Kanban Stages)
```sql
create table public.columns (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  order_index integer not null default 0,
  wip_limit integer,
  exit_policy text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.columns enable row level security;
```

## 4. Tasks (Work Items)
```sql
create type priority_level as enum ('low', 'medium', 'high', 'urgent');

create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  column_id uuid references public.columns(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  order_index integer not null default 0,
  assignee_id uuid references public.profiles(id) on delete set null,
  priority priority_level default 'medium',
  end_date timestamp with time zone,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tasks enable row level security;
```

## 5. Indexes for Performance & AI Querying
```sql
-- Speed up board rendering and AI search
create index idx_tasks_column_id on public.tasks(column_id);
create index idx_tasks_project_id on public.tasks(project_id);
create index idx_columns_project_id on public.columns(project_id);
create index idx_tasks_order on public.tasks(order_index);
```

## 6. AI-Specific Considerations
*   **`exit_policy`**: This text field in `columns` is designed for the AI to parse before moving a task.
*   **`metadata`**: A JSONB field in `tasks` to store AI-generated tags, risk scores, or sub-task summaries.
*   **`order_index`**: Crucial for the AI to perform "Auto-Prioritization" by simply updating integers.

---
**Sources**: PRD Zentask, 2026.
**Status**: Final Design for Implementation.
