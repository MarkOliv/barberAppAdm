begin if new.raw_user_meta_data ->> 'barber' is not null then
insert into
    public.barbers (
        id,
        barber,
        full_name,
        specialties,
        avatar_url,
        created_at
    )
values
    (
        new.id,
        new.raw_user_meta_data ->> 'barber',
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'specialties',
        new.raw_user_meta_data ->> 'avatar_url',
        current_timestamp
    );

end if;

return new;

end;