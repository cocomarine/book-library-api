const express = require('express');
const authorController = require('../controllers/author');

const authorRouter = express.Router();

authorRouter.post('/', authorController.createAuthor);
authorRouter.get('/', authorController.getAllAuthors);
authorRouter.get('/:id', authorController.getAuthorById);
authorRouter.patch('/:id', authorController.updateAuthorById);
authorRouter.delete('/:id', authorController.deleteAuthorById);

module.exports = authorRouter;