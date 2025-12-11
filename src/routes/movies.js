const express = require('express');
const moviesRouter = express.Router();

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../public/images'));
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});
const upload = multer({storage});

const moviesControllers = require('../controllers/movies');

moviesRouter.get('/', moviesControllers.showAllMovies);

moviesRouter.get('/new', moviesControllers.showAddMovie);
moviesRouter.post('/', upload.single('image'), moviesControllers.addMovie);

moviesRouter.get('/:id', moviesControllers.showMovie);
moviesRouter.get('/:id/edit', moviesControllers.showUpdateMovie);
moviesRouter.post('/:id/update', upload.single('image'), moviesControllers.updateMovie); // html forms don't have delete and put as methods so can install library to convert to methods or jsut paths and post
moviesRouter.post('/:id/delete', moviesControllers.deleteMovie);

module.exports = moviesRouter;