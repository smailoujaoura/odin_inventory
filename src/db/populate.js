#! /usr/bin/node

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../../.env")});

const SQL = `
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    image TEXT,
    binary_image BYTEA
);

CREATE TABLE IF NOT EXISTS actors (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS movies_actors (
    movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
    actor_id INTEGER REFERENCES actors(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, actor_id)
);

CREATE TABLE IF NOT EXITS movies_genres (
	movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
	actor_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

-- Insert Movies
INSERT INTO movies (name, year, image) VALUES 
('Inception', 2010, '/images/inception.jpg'),
('The Dark Knight', 2008, '/images/dark_knight.jpg'),
('Pulp Fiction', 1994, '/images/pulp_fiction.jpg'),
('The Matrix', 1999, '/images/matrix.jpg'),
('Interstellar', 2014, '/images/interstellar.jpg');

-- Insert Actors
INSERT INTO actors (name) VALUES 
('Leonardo DiCaprio'),
('Christian Bale'),
('John Travolta'),
('Keanu Reeves'),
('Matthew McConaughey');

-- Insert Genres
INSERT INTO genres (name) VALUES 
('Sci-Fi'),
('Action'),
('Drama'),
('Crime');

-- Link Movies & Actors (Using subqueries so it works without hardcoded IDs)
INSERT INTO movies_actors (movie_id, actor_id) VALUES 
((SELECT id FROM movies WHERE name = 'Inception'), (SELECT id FROM actors WHERE name = 'Leonardo DiCaprio')),
((SELECT id FROM movies WHERE name = 'The Dark Knight'), (SELECT id FROM actors WHERE name = 'Christian Bale')),
((SELECT id FROM movies WHERE name = 'Pulp Fiction'), (SELECT id FROM actors WHERE name = 'John Travolta')),
((SELECT id FROM movies WHERE name = 'The Matrix'), (SELECT id FROM actors WHERE name = 'Keanu Reeves')),
((SELECT id FROM movies WHERE name = 'Interstellar'), (SELECT id FROM actors WHERE name = 'Matthew McConaughey'));

-- Link Movies & Genres
INSERT INTO movies_genres (movie_id, genre_id) VALUES 
((SELECT id FROM movies WHERE name = 'Inception'), (SELECT id FROM genres WHERE name = 'Sci-Fi')),
((SELECT id FROM movies WHERE name = 'The Dark Knight'), (SELECT id FROM genres WHERE name = 'Action')),
((SELECT id FROM movies WHERE name = 'Pulp Fiction'), (SELECT id FROM genres WHERE name = 'Crime')),
((SELECT id FROM movies WHERE name = 'The Matrix'), (SELECT id FROM genres WHERE name = 'Sci-Fi'));
`;

async function main() {
	console.log("seeding...");
	const client = new Client({
		connectionString: process.env.DB_URL
	});

	await client.connect();
	await client.query(SQL);
	await client.end();
	
	console.log("done");
}

main();
