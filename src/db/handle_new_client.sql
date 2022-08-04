-- inserts a row into public.users
create function public.handle_new_user() returns trigger language plpgsql security definer
set
    search_path = public as $ $ begin
insert into
    public.clients (
        id,
        full_name,
        "address",
        bio,
        client,
        created_at
    )
values
    (
        new.id,
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'address',
        new.raw_user_meta_data ->> 'bio',
        new.raw_user_meta_data ->> 'client',
        current_timestamp
    );

return new;

end;

$ $;

-- trigger the function every time a user is created
create trigger on_auth_user_created
after
insert
    on auth.users for each row execute procedure public.handle_new_user();