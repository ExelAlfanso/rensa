create or replace function public.create_profile()
returns trigger as $$
begin
  insert into public.users (id, email, username, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on next_auth.users
for each row execute procedure public.create_profile();