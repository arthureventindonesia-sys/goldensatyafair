alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('pending', 'submitted', 'paid', 'expired', 'cancelled'));

create table if not exists payment_proofs (
  order_id text primary key references orders(id) on delete cascade,
  user_id text not null,
  file_name text not null,
  mime text not null,
  data text not null,
  uploaded_at timestamptz not null default now()
);

create index if not exists payment_proofs_user_id_idx on payment_proofs (user_id);
