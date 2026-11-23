alter policy "Users can view own profile" on consultation
  using (
    (auth.uid() = user_id) or
    -- Let admin see everything
    (exists (
      select *
      from public.app_role
      where auth.uid() = public.app_role.id and public.app_role.role = 'admin'
    ))
  );