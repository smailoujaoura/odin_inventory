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

async function name(name, ) {
	
}