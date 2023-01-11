const express = require('express');
const genreController = require('../controllers/genre');

const genreRouter = express.Router();

genreRouter.post('/', genreController.createGenre);
genreRouter.get('/', genreController.getAllGenres);
genreRouter.get('/:id', genreController.getGenreById);
genreRouter.patch('/:id', genreController.updateGenreById);
genreRouter.delete('/:id', genreController.deleteGenreById);

module.exports = genreRouter;