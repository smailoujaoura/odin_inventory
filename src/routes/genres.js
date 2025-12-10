const express = require('express');
const genresRouter = express.Router();

const genresControllers = require('../controllers/genres');

genresRouter.get('/', genresControllers.showAllGenres);

module.exports = genresRouter;