DROP DATABASE IF EXISTS moviesdb;
CREATE DATABASE moviesdb;

USE moviesdb;

CREATE TABLE movie (
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(uuid())),
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    director VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    poster TEXT,
    rate DECIMAL(2, 1) unsigned NOT NULL
);

CREATE TABLE genre (
	id INT auto_increment primary KEY,
    name varchar(255) NOT NULL unique
);

CREATE TABLE movie_genres (
	movie_id binary(16) references movies(id),
    genre_id int references genres(id),
    primary key (movie_id, genre_id)
);

INSERT INTO genre (name) values
("Drama"), ("Action"), ("Crime"), ("Adventure"), ("Sci-Fi"), ("Romance");

INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
(uuid_to_bin(uuid()), "Batman Begins", 2010, "Cristopher Nolan", 140, "https://www.imdb.com/title/tt0450392/mediaviewer/rm2423076865/?ref_=tt_ov_i", 9.0),
(uuid_to_bin(uuid()), "Pirates of the Caribbean: The Curse of the Black Pearl", 2003, "Gore Verbinski", 143, "https://www.imdb.com/title/tt0325980/mediaviewer/rm2487103488/?ref_=tt_ov_i", 8.1),
(uuid_to_bin(uuid()), "The Lord of the Rings: The Fellowship of the Ring", 2001, "Peter Jackson", 180, "https://www.imdb.com/title/tt0120737/mediaviewer/rm3592958976/?ref_=tt_ov_i", 8.9);

INSERT INTO movie_genres (movie_id, genre_id) values
((select id from movie where title = "Batman Begins"), (select id from genre where name = "Action")),
((select id from movie where title = "Batman Begins"), (select id from genre where name = "Crime")),
((select id from movie where title = "Pirates of the Caribbean: The Curse of the Black Pearl"), (select id from genre where name = "Adventure")),
((select id from movie where title = "Pirates of the Caribbean: The Curse of the Black Pearl"), (select id from genre where name = "Action")),
((select id from movie where title = "The Lord of the Rings: The Fellowship of the Ring"), (select id from genre where name = "Sci-Fi"));

SELECT *, bin_to_uuid(id) id FROM movie;

select *, bin_to_uuid(movie_id) movie_id from movie_genres;

select movie.*, genre.name as genre from movie_genres
join movie on movie.id = movie_genres.movie_id
join genre on genre.id = movie_genres.genre_id;

select *, bin_to_uuid(id) id from movie;
update movie set year = 1977 where title = "The Godfather"
