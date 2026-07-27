-- Permite que uma página do construtor apareça automaticamente no menu do header.
alter table public.pages
  add column show_in_menu boolean not null default false,
  add column menu_label text,
  add column menu_order integer not null default 0;
