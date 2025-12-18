-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE (Extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  first_name text,
  last_name text,
  role text check (role in ('student', 'parent', 'admin')) default 'student',
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  last_login_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUESTIONS TABLE (Stores default and custom questions)
create table questions (
  id uuid default uuid_generate_v4() primary key,
  text text not null,
  options jsonb not null, -- Array of strings
  correct_answer integer not null, -- Index: 0-3
  explanation text,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  subject text check (subject in ('math', 'science')),
  topic_id text,
  creator_id uuid references auth.users(id), -- Null for default questions
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER PROGRESS TABLE (Tracks topic completion)
create table user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  topic_id text not null,
  score integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, topic_id) -- Only one best record per topic per user
);

-- ACHIEVEMENTS TABLE (User unlocks)
create table user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  achievement_id text not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
alter table profiles enable row level security;
alter table questions enable row level security;
alter table user_progress enable row level security;
alter table user_achievements enable row level security;

-- Profiles: Public read, Self update
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Questions: Everyone can read, Only Admins/Creators can insert
create policy "Questions are viewable by everyone." on questions for select using (true);
create policy "Authenticated users can create questions." on questions for insert with check (auth.role() = 'authenticated');

-- Progress & Achievements: Self read/write
create policy "Users can read own progress." on user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress." on user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress." on user_progress for update using (auth.uid() = user_id);

create policy "Users can read own achievements." on user_achievements for select using (auth.uid() = user_id);
create policy "Users can insert own achievements." on user_achievements for insert with check (auth.uid() = user_id);

-- TRIGGER: Create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username, first_name, last_name, role)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'firstName', new.raw_user_meta_data->>'lastName', 'student');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
