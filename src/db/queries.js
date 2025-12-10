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
		return movieId;

	} catch (e) {
		await client.query('ROLLBACK');
		console.error(e);
		throw e;
	} finally {
		client.release();
	}
}

module.exports = {
	getAllMovies,
	getMovieById,
	addMovie
};