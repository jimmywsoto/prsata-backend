# Paso 1. Tabla validation_campaigns

create table public.validation_campaigns (

    id uuid primary key default gen_random_uuid(),

    name text not null,

    period varchar(7) not null,

    description text,

    planet_mosaic text,

    geojson_version text,

    status text default 'draft'
        check(status in ('draft','active','closed')),

    created_by uuid references app_users(id),

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);

#Paso 2. Tabla validation_blocks

create table public.validation_blocks (

    id bigint generated always as identity primary key,

    campaign_id uuid not null
        references validation_campaigns(id)
        on delete cascade,

    cod integer,

    provincia text,

    canton text,

    parroquia text,

    nombre text,

    delimitacion text,

    validacion smallint,

    bloque integer,

    geometry jsonb not null,

    assigned_to uuid
        references app_users(id),

    assigned_at timestamptz,

    validation_status text
        default 'pending'
        check(
            validation_status in
            (
                'pending',
                'assigned',
                'in_progress',
                'completed'
            )
        ),

    validated_by uuid
        references app_users(id),

    validated_at timestamptz,

    comments text,

    created_at timestamptz default now(),

    updated_at timestamptz default now()

);

create index idx_blocks_campaign
on validation_blocks(campaign_id);

create index idx_blocks_bloque
on validation_blocks(bloque);

create index idx_blocks_assigned
on validation_blocks(assigned_to);

create index idx_blocks_status
on validation_blocks(validation_status);