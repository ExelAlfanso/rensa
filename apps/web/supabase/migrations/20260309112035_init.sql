DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS photo_metadata;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS rolls;
DROP TABLE IF EXISTS roll_photos;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS bug_reports;

create type user_role as enum ('user', 'admin');

create type contact_status as enum ('new', 'read', 'responded');

create type bug_severity as enum ('low', 'medium', 'high', 'critical');

create type bug_status as enum (
  'new',
  'investigating',
  'acknowledged',
  'resolved',
  'closed'
);

create table users (
  user_id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique not null,
  password text not null,
  avatar text,
  role user_role default 'user',
  verified boolean default false,
  password_changed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table photos (
  photo_id uuid primary key default gen_random_uuid(),
  user_id uuid references users(user_id) on delete cascade,
  url text not null,
  title text not null,
  description text,
  category text,
  style text,
  color text,
  camera text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table photo_metadata (
  photo_metadata_id uuid primary key references photos(photo_id) on delete cascade,
  width integer,
  height integer,
  format text,
  size integer,
  uploaded_at timestamptz
);

create table bookmarks (
  bookmark_id uuid primary key default gen_random_uuid(),
  photo_id uuid references photos(photo_id) on delete cascade,
  user_id uuid references users(user_id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique (photo_id, user_id)
);

create table comments (
  comment_id uuid primary key default gen_random_uuid(),
  photo_id uuid references photos(photo_id) on delete cascade,
  user_id uuid references users(user_id) on delete cascade,
  text text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table rolls (
  roll_id uuid primary key default gen_random_uuid(),
  user_id uuid references users(user_id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table roll_photos (
  roll_id uuid references rolls(roll_id) on delete cascade,
  photo_id uuid references photos(photo_id) on delete cascade,

  primary key (roll_id, photo_id)
);

create table contacts (
  contact_id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  ip_address text,
  user_agent text,
  status contact_status default 'new',
  responded_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table bug_reports (
  bug_report_id uuid primary key default gen_random_uuid(),
  title text not null,
  email text not null,
  description text not null,
  steps text,
  expected_behavior text,
  actual_behavior text,
  browser text,
  attachments text,
  severity bug_severity default 'medium',
  status bug_status default 'new',
  ip_address text,
  user_agent text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table bookmarks (
  bookmark_id uuid primary key default gen_random_uuid(),
  photo_id uuid references photos(photo_id) on delete cascade,
  user_id uuid references users(user_id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique (photo_id, user_id)
);

create index idx_photos_user on photos(user_id);

create index idx_comments_photo on comments(photo_id);

create index idx_comments_user on comments(user_id);

create index idx_bookmarks_photo on bookmarks(photo_id);

create index idx_rolls_user on rolls(user_id);

create index idx_contacts_email on contacts(email);

create index idx_bug_reports_email on bug_reports(email);