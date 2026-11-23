-- Restrict the range of values that will
-- be accepted as a valid role type. This
-- allows both the database and application
-- layers to effectively share a single
-- type that is easy to keep in sync.

-- NOTE: Whenever this is updated, the matching
-- type in the application code must also be
-- updated to match.
create type role_type as enum (
  'user',
  'admin'
);

create table public.app_role (
  id uuid references auth.users,
  role role_type
);
ALTER TABLE public.app_role ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own role" ON app_role
  FOR SELECT USING (auth.uid() = id);