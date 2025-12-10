const express = require('express');
const moviesRouter = express.Router();

const moviesControllers = require('../controllers/movies');

moviesRouter.get('/', moviesControllers.showAllMovies);
moviesRouter.get('/:id', moviesControllers.showMovie);
moviesRouter.post('/:id', moviesControllers.addMovie);
moviesRouter.put('/:id', moviesControllers.updateMovie);
moviesRouter.delete('/:id', moviesControllers.deleteMovie);

module.exports = moviesRouter;