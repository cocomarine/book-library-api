const express = require('express');
const { Reader } = require('./models');
const readerRouter = require('./routes/reader');
const bookRouter = require('./routes/book');
const readerController = require('./controllers/reader');
const bookController = require('./controllers/book');

const app = express();

app.use(express.json());
app.use('/readers', readerRouter);
app.use('/books', bookRouter);

module.exports = app;
