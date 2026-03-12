-- Supabase SQL Editor で実行してください
create table if not exists diagnosis_results (
  id uuid primary key default gen_random_uuid(),
  taken_at timestamptz not null,
  type_id text not null,
  scores jsonb not null,
  raw_answers jsonb not null,
  created_at timestamptz default now()
);

-- 行レベルセキュリティを有効化
alter table diagnosis_results enable row level security;

-- 匿名ユーザーの INSERT のみ許可（診断結果の送信）
create policy "allow_anon_insert" on diagnosis_results
  for insert to anon with check (true);

-- SELECT は service_role のみ（API経由で管理者のみ閲覧）
-- anon / authenticated への SELECT は許可しない
