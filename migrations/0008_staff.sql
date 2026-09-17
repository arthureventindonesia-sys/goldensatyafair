create table if not exists staff (
  username text primary key,
  password_hash text not null,
  role text not null check (role in ('admin', 'crew')),
  created_at timestamptz not null default now()
);

create index if not exists staff_role_idx on staff (role);
