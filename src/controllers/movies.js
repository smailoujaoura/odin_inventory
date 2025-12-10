const db = require('../db/queries');

async function showAllMovies(req, res) {
	const movies = await 
	res.render('movies', {});
}

function showMovie(req, res) {
	// res.
}

function addMovie(req, res) {

}

function updateMovie(req, res) {

}

function deleteMovie(req, res) {

}

module.exports = { 
	showAllMovies,
	showMovie,
	addMovie,
	updateMovie,
	deleteMovie
}