insert into ticket_types (id, name, price_idr, quota, per_user_limit, sort_order)
values ('vvip', 'VVIP', 2000, 100, 5, 0)
on conflict (id) do nothing;

update ticket_types set sort_order = 0 where id = 'vvip';
update ticket_types set sort_order = 1 where id = 'vip';
update ticket_types set sort_order = 2 where id = 'festival';

create table if not exists ticket_stages (
  id text primary key,
  name text not null,
  enabled boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer not null default 0
);

create table if not exists ticket_stage_offers (
  stage_id text not null references ticket_stages(id) on delete cascade,
  ticket_type_id text not null references ticket_types(id),
  price_idr integer not null,
  quota integer not null,
  primary key (stage_id, ticket_type_id)
);

alter table orders add column if not exists stage_id text;
create index if not exists orders_stage_id_idx on orders (stage_id);

insert into ticket_stages (id, name, enabled, starts_at, ends_at, sort_order)
values
  ('early_bird', 'Early Bird', true, '2026-09-01 00:00:00+07', '2026-10-15 23:59:00+07', 1),
  ('presale_1', 'Presale 1', false, '2026-10-16 00:00:00+07', '2026-10-31 23:59:00+07', 2),
  ('presale_2', 'Presale 2', false, '2026-11-01 00:00:00+07', '2026-11-13 23:59:00+07', 3),
  ('on_the_spot', 'On the spot', false, '2026-11-14 12:00:00+07', '2026-11-14 22:30:00+07', 4)
on conflict (id) do nothing;

insert into ticket_stage_offers (stage_id, ticket_type_id, price_idr, quota)
values
  ('early_bird', 'vip', 1000, 100),
  ('early_bird', 'festival', 500, 200),
  ('presale_1', 'vvip', 2000, 30),
  ('presale_1', 'vip', 1000, 150),
  ('presale_1', 'festival', 500, 400),
  ('presale_2', 'vvip', 2000, 40),
  ('presale_2', 'vip', 1000, 150),
  ('presale_2', 'festival', 500, 500),
  ('on_the_spot', 'vvip', 2000, 20),
  ('on_the_spot', 'vip', 1000, 50),
  ('on_the_spot', 'festival', 500, 200)
on conflict (stage_id, ticket_type_id) do nothing;
