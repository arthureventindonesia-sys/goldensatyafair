create table if not exists buyer_profiles (
  user_id text primary key,
  email text not null,
  whatsapp text not null,
  created_at timestamptz not null default now()
);

create index if not exists buyer_profiles_email_idx on buyer_profiles (email);
