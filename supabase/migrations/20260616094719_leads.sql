CREATE TYPE lead_status AS ENUM (
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'VIBE_CHECK_SENT',
    'CONFIRMED',
    'NOT_A_FIT'
);

CREATE TYPE group_type AS ENUM (
    'SOLO',
    'FRIENDS',
    'COUPLE',
    'FAMILY'
);


CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    group_type group_type NOT NULL,
    preferred_month DATE NOT NULL,
    enquirer_note TEXT,
    status lead_status NOT NULL DEFAULT 'NEW',
    owner_id UUID REFERENCES team(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE lead_touchpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES team(id) ON DELETE SET NULL,
    contact_via TEXT NOT NULL, 
    note TEXT NOT NULL,
    next_action TEXT,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_trip ON leads(trip_id);
CREATE INDEX idx_leads_owner ON leads(owner_id);
