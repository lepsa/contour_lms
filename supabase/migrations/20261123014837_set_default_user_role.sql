-- When a new user is inserted into the users table
-- populate the app_role table with a new entry for
-- the new user.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.app_role (id, role)
  values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update the consultation policy to allow admins
-- to view all active consultations.
alter policy "Users can view own profile" on consultation
  using (
    (auth.uid() = id) or
    -- Let admin see everything
    (exists (
      select *
      from public.app_role
      where auth.uid() = public.app_role.id and public.app_role.role = 'admin'
    ))
  );