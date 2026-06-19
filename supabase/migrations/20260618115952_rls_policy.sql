alter table trips enable row level security;
alter table leads enable row level security;
alter table lead_touchpoints enable row level security;
alter table team enable row level security;

create policy "Public can read open trips"
on trips
for select
to anon, authenticated
using (status = 'open');

create policy "Public can create lead enquiries"
on leads
for insert
to anon, authenticated
with check (
  owner_id is null
);