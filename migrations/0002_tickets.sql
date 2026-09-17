create table if not exists ticket_types (
  id text primary key,
  name text not null,
  price_idr integer not null,
  quota integer not null,
  per_user_limit integer not null default 5,
  sort_order integer not null default 0
);

insert into ticket_types (id, name, price_idr, quota, per_user_limit, sort_order)
values
  ('vip', 'VIP', 1000, 200, 5, 1),
  ('festival', 'Festival', 500, 2500, 5, 2)
on conflict (id) do nothing;

create table if not exists orders (
  id text primary key,
  user_id text not null,
  ticket_type_id text not null references ticket_types(id),
  quantity integer not null check (quantity > 0),
  gross_amount integer not null,
  email text not null,
  whatsapp text not null,
  status text not null check (status in ('pending', 'paid', 'expired', 'cancelled')),
  payment_type text,
  midtrans_token text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists orders_user_id_idx on orders (user_id);
create index if not exists orders_status_created_idx on orders (status, created_at);
create index if not exists orders_type_status_idx on orders (ticket_type_id, status);

create table if not exists tickets (
  id text primary key,
  order_id text not null references orders(id),
  user_id text not null,
  ticket_type_id text not null,
  code text not null unique,
  holder_email text not null,
  holder_whatsapp text not null,
  created_at timestamptz not null default now()
);

create index if not exists tickets_user_id_idx on tickets (user_id);
create index if not exists tickets_code_idx on tickets (code);
create index if not exists tickets_order_id_idx on tickets (order_id);
