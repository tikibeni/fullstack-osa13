create table blogs (id serial primary key, author text, url text not null, title text not null, likes integer default 0);
insert into blogs (author, url, title, likes) values ('devaaja', 'TBA', 'postgren salat', 123);
insert into blogs (url, title, likes) values ('nope', 'ohjelmistotestauksen nautinto', 12);
