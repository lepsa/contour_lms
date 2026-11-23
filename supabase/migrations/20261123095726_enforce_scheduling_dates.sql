alter policy "Users can update their own consultation" on consultation
  using (
    (auth.uid() = user_id) or 
    -- Let admin update everything
    (exists (
      select *
      from public.app_role
      where auth.uid() = public.app_role.id and public.app_role.role = 'admin'
    ))
  )
  -- With check looks at the new row. This is where we need to enforce the date checks.
  with check (
    scheduled >= (now() + interval '1 day') and
    (
      auth.uid() = user_id or
      exists (
        select *
        from public.app_role
        where auth.uid() = public.app_role.id and public.app_role.role = 'admin'
      )
    )
  );

alter policy "Users can add their own consultation" on consultation
  with check (
    scheduled >= (now() + interval '1 day') and
    (
      auth.uid() = user_id or
      exists (
        select *
        from public.app_role
        where auth.uid() = public.app_role.id and public.app_role.role = 'admin'
      )
    )
  );
