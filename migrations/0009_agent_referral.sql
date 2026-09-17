alter table staff add column if not exists referral_code text;
alter table orders add column if not exists referral_code text;
create index if not exists orders_referral_idx on orders (referral_code);
