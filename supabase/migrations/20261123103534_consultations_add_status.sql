-- Restrict how we represent the outcome of a consult. They can be
-- completed, incomplete, or not yet marked (null)
create type consultation_status as enum (
  'complete',
  'incomplete'
);

alter table public.consultation
add column status consultation_status;