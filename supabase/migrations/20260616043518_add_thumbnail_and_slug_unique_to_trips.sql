alter table trips
add column thumbnail text;

alter table trips
add constraint trips_slug_unique unique (slug);