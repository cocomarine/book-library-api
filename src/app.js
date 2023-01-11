const express = require('express');
const { Reader } = require('./models');
const readerRouter = require('./routes/reader');
const bookRouter = require('./routes/book');
const authorRouter = require('./routes/author');

const app = express();

app.use(express.json());
app.use('/readers', readerRouter);
app.use('/books', bookRouter);
app.use('/authors', authorRouter);

module.exports = app;
