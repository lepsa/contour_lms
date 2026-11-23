-- Allow users to update rows where they already own the row
create policy "Users can update their own consultation" on consultation
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);