create policy "Users can add their own consultation" on consultation
  for insert with check (auth.uid() = user_id)
