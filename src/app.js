const express = require('express');
const swaggerUi = require('swagger-ui-express');

const readerRouter = require('./routes/reader');
const bookRouter = require('./routes/book');
const authorRouter = require('./routes/author');
const genreRouter = require('./routes/genre');

const app = express();

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Book Library APIs',
//       version: '1.0.0',
//     },
//     servers: [
//       {
//         url: "http://localhost:4000",
//       },
//     ],
//   },
//   apis: ['./routes/*.js', './controllers/*.js'], 
// }

const swaggerDocument = require('./swagger.json');

app.use(express.json());

app.use('/readers', readerRouter);
app.use('/books', bookRouter);
app.use('/authors', authorRouter);
app.use('/genres', genreRouter);
app.use(
  '/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);

module.exports = app;
