-- Create a table for user watchlists
create table watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  symbol text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, symbol)
);

-- Enable Row Level Security (RLS)
alter table watchlist enable row level security;

-- Create policies
create policy "Users can view their own watchlist"
  on watchlist for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own watchlist"
  on watchlist for insert
  with check (auth.uid() = user_id);

create policy "Users can delete from their own watchlist"
  on watchlist for delete
  using (auth.uid() = user_id);
