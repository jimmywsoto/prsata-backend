create table public.access_requests (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null references public.app_users(id) on delete cascade,

    request_status text not null default 'PENDING'
        check (request_status in ('PENDING', 'APPROVED', 'REJECTED')),

    request_message text,

    reviewed_by uuid references public.app_users(id),

    reviewed_at timestamptz,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()
);

create index idx_access_requests_user_id
on public.access_requests(user_id);

create index idx_access_requests_status
on public.access_requests(request_status);

create or replace function public.update_acces_request_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_access_requests_updated_at
before update on public.access_requests
for each row
execute function public.update_acces_request_updated_at_column();