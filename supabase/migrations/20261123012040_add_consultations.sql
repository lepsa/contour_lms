create table public.consultation (
  id uuid not null primary key,
  user_id uuid not null references auth.users,
   -- For any of a myriad of reasons, names are best left as nullable text where we perform a minimum of validation and processing
  first_name text,
  last_name text,
  reason text not null,
  -- Properly timestamp dates as we don't want to deal with the headache that is managing data stored as local time, especially when
  -- dealing with daylight savings across borders.
  scheduled timestamptz not null,
  -- Flag to track if a user has "deleted" this consultation or not.
  -- This allows us to keep history around if we need an audit log of
  -- what they did.
  active boolean not null,
  created_at timestamptz not null default now()
);
ALTER TABLE public.consultation ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON consultation
  -- Don't let users see their deleted consultations.
  FOR SELECT USING (auth.uid() = id and active = true);
