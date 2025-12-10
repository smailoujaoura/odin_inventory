const express = require('express');
const mainRouter = express.Router();

const mainController = require('../controllers/main');

mainRouter.get('/', mainController);

module.exports = mainRouter;
