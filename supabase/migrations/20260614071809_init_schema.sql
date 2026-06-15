create table if not exists trips (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null,
    origin text not null,
    destination text not null,
    start_date date not null,
    end_date date not null,
    price integer not null,
    total_seats integer not null,
    description text not null,
    status text not null
        check (status in ('open', 'closed'))
        default 'open',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists team (
    id uuid primary key
        references auth.users(id)
        on delete cascade,
    full_name text not null,
    role text not null
        check (role in ('admin', 'sales')),
    is_active boolean not null default true,
     created_by uuid
        references team(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);