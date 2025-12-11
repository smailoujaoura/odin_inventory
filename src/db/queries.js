const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.DB_URL
});

async function getAllMovies() {
	const { rows } = await pool.query('SELECT * FROM movies');
	return rows;
}

async function getMovieById(id) {
	const { rows } = await pool.query('SELECT * FROM movies WHERE id=$1', [id]);
	return rows[0];	
}


async function addMovie(movie, actorNames, genreNames) {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const movieRes = await client.query(
			'INSERT INTO movies (name, year, image) VALUES ($1, $2, $3) RETURNING id',
			[movie.name, movie.year, movie.image]
		);
		const movieId = movieRes.rows[0].id;

		const resolveId = (table, name) => {
			return client.query(
				`INSERT INTO ${table} (name) VALUES ($1) 
				ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name
				RETURNING id`, [name]
			).then(res => res.rows[0].id);
		};

		const actorIds = await Promise.all(actorNames.map(name => resolveId('actors', name)));
		const genreIds = await Promise.all(genreNames.map(name => resolveId('genres', name)));

		await Promise.all(actorIds.map(actorId => 
			client.query('INSERT INTO movies_actors (movie_id, actor_id) VALUES ($1, $2)', [movieId, actorId])
		));
		await Promise.all(genreIds.map(genreId => 
			client.query('INSERT INTO movies_genres (movie_id, genre_id) VALUES ($1, $2)', [movieId, genreId])
		));

		await client.query('COMMIT');

		console.log("ADDED MOVIE");
		return movieId;

	} catch (e) {
		await client.query('ROLLBACK');
		console.error(e);
		throw e;
	} finally {
		client.release();
	}
}

async function getActorsByMovieId(movieId) {
	const { rows } = await pool.query(`
		SELECT actors.name
		FROM actors
		JOIN movies_actors ON actors.id = movies_actors.actor_id
		WHERE movies_actors.movie_id = $1
	`, [movieId]);

	return rows;
}

async function getGenresByMovieId(movieId) {
	const {rows} = await pool.query(`
		SELECT genres.name
		FROM genres
		JOIN movies_genres ON genres.id = movies_genres.genre_id
		WHERE movies_genres.movie_id = $1	
	`, [movieId]);

	return rows;
}

async function updateMovie(movieId, movie, actorNames, genreNames) {
	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		await client.query(
			`UPDATE movies
			SET name = $1, year = $2, image = COALESCE($3, image)
			WHERE id = $4`,
			[movie.name, movie.year, movie.image, movieId]
		);

		const resolveId = (table, name) => {
			return client.query(
				`INSERT INTO ${table} (name) VALUES ($1)
				ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name
				RETURNING id`,
				[name]
			).then(res => res.rows[0].id);
		}

		const actorIds = await Promise.all(actorNames.map(name => resolveId('actors', name)));
		const genreIds = await Promise.all(genreNames.map(name => resolveId('genres', name)));

		await client.query('DELETE FROM movies_actors WHERE movie_id = $1', [movieId]);
		await client.query('DELETE FROM movies_genres WHERE movie_id = $1', [movieId]);

		await Promise.all(actorIds.map(actorId => 
            client.query('INSERT INTO movies_actors (movie_id, actor_id) VALUES ($1, $2)', [movieId, actorId])
        ));

		await Promise.all(genreIds.map(genreId => 
            client.query('INSERT INTO movies_genres (movie_id, genre_id) VALUES ($1, $2)', [movieId, genreId])
        ));

		await client.query('COMMIT');
	} catch (e) {
		await client.query('ROLLBACK');
		throw e;
	} finally {
		client.release();
	}
}

async function deleteMovie(movieId) {
	await pool.query('DELETE FROM movies WHERE id = $1', [movieId]);
}

module.exports = {
	getAllMovies,
	getMovieById,
	addMovie,
	getActorsByMovieId,
	getGenresByMovieId,
	updateMovie,
	deleteMovie
};

