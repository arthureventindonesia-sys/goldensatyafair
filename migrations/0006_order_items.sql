create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  ticket_type_id text not null references ticket_types(id),
  quantity integer not null check (quantity > 0),
  unit_price integer not null,
  unique (order_id, ticket_type_id)
);

insert into order_items (id, order_id, ticket_type_id, quantity, unit_price)
select
  'oi-' || o.id,
  o.id,
  o.ticket_type_id,
  o.quantity,
  case when o.quantity > 0 then (o.gross_amount / o.quantity) else 0 end
from orders o
where not exists (
  select 1 from order_items i where i.order_id = o.id
);

create index if not exists order_items_order_id_idx on order_items (order_id);
create index if not exists order_items_type_idx on order_items (ticket_type_id);
