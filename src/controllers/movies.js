const db = require('../db/queries');

async function showAllMovies(req, res) {
	const movies = await db.getAllMovies();
	res.render('movies', {movies});
}

async function showMovie(req, res) {
	const movieId = req.params.id;
	
	// const movie = await db.getMovieById(movieId);
	// if (!movie) {
	// 	return res.status(404).render('404', {title: 'Not Found'});
	// }
	// const actors = await db.getActorsByMovieId(movieId);
	// const genres = await db.getGenresByMovieId(movieId);

	const [movie, actors, genres] = await Promise.all([
		db.getMovieById(movieId),
		db.getActorsByMovieId(movieId),
		db.getGenresByMovieId(movieId)
	]);

	if (!movie) {
		return res.status(404).render('404', {title: "Not Found"});
	}

	res.render('movie', {
		movie,
		title: movie.name,
		actors,
		genres
	});
}

function showAddMovie(req, res) {
	res.render('addMovie');
}

async function addMovie(req, res) {
	const { name, year, actors, genres } = req.body;
	const imagePath = req.file ? `/images/${req.file.filename}` : null;

	const actorList = actors ? actors.split(',').map(s => s.trim()).filter(Boolean) : [];
	const genreList = genres ? genres.split(',').map(s => s.trim()).filter(Boolean) : [];

	await db.addMovie(
		{name, year, image: imagePath},
		actorList,
		genreList
	);

	res.redirect('/movies');
}

async function showUpdateMovie(req, res) {
	const movieId = req.params.id;

	const [movie, actors, genres] = await Promise.all([
		db.getMovieById(movieId),
		db.getActorsByMovieId(movieId),
		db.getGenresByMovieId(movieId)
	]);

	if (!movie) return res.status(404).render('404', { title: 'Not Found' });

	const actorString = actors.map(a => a.name).join(', ');
	const genreString = genres.map(g => g.name).join(', ');

	res.render('editMovie', { 
		title: `Edit ${movie.name}`,
		movie: movie,
		actorString: actorString,
		genreString: genreString
	});
}

async function updateMovie(req, res) {
	const movieId = req.params.id;
	const { name, year, actors, genres } = req.body;

	try {
		const oldMovie = await db.getMovieById(movieId);

		if (!oldMovie) {
			return res.status(404).render('404', {title: "Not found"});
		}

		const imagePath = req.file ? `/images/${req.file.filename}` : oldMovie.image;

		const actorList = actors ? actors.split(',').map(s => s.trim()).filter(Boolean) : [];
		const genreList = genres ? genres.split(',').map(s => s.trim()).filter(Boolean) : [];

		await db.updateMovie(
			movieId,
			{name, year, image: imagePath},
			actorList,
			genreList
		);

		res.redirect(`/movies/${movieId}`);

	} catch (err) {
		console.error(err);
		res.status(500).send("Error updaing movie");
	}
}

async function deleteMovie(req, res) {
	try {
		await db.deleteMovie(req.params.id);
		res.redirect('/movies');
	} catch (err) {
		console.error(err);
		res.status(500).send('eror deleting movie');
	}
}

module.exports = { 
	showAllMovies,
	showMovie,
	addMovie,
	updateMovie,
	deleteMovie,
	showAddMovie,
	showUpdateMovie
};