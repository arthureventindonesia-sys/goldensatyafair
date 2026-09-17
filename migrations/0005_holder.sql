alter table orders add column if not exists holder_name text;
alter table orders add column if not exists holder_address text;
alter table tickets add column if not exists holder_name text;
alter table tickets add column if not exists holder_address text;
