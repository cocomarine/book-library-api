const { expect } = require('chai');
const request = require('supertest');
const { Book, Author, Genre } = require('../src/models');
const { errorNull, errorEmpty, errorNotUnique, errorNotPresent } = require('./helpers');
const app = require('../src/app');

describe('/books', () => {
    before(async () => Book.sequelize.sync());

    describe('with no records in the database', () => {
        describe('POST /books', () => {

            let testBook;
            let testAuthor;
            let testGenre;

            beforeEach(async () => {
                await Book.destroy({ where: {} });
                await Author.destroy({ where: {} });
                await Genre.destroy({ where: {} });

                testAuthor = await Author.create({ author: 'Matt Haig' });
                testGenre = await Genre.create({ genre: 'Contemporary Fiction' });

                testBook = {
                    title: 'The Midnight Library',
                    ISBN: '978-0-525-55948-1',
                    AuthorId: testAuthor.id,
                    GenreId: testGenre.id,
                };
            });

            it('creates a new book in the database', async () => {
                const response = await request(app)
                    .post('/books')
                    .send(testBook);
                
                const newBookRecord = await Book.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(201);
                expect(response.body.title).to.equal('The Midnight Library');
                expect(response.body.ISBN).to.equal('978-0-525-55948-1');

                expect(newBookRecord.title).to.equal('The Midnight Library');
                expect(newBookRecord.AuthorId).to.equal(testAuthor.id);
                expect(newBookRecord.GenreId).to.equal(testGenre.id);
                expect(newBookRecord.ISBN).to.equal('978-0-525-55948-1');
            });

            it('returns error when title is not provided', async () => {
                testBook.title = null;
                const response = await request(app)
                    .post('/books')
                    .send(testBook);

                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorNull('title'));
            });

            it('returns error when title is empty', async () => {
                testBook.title = '  ';
                const response = await request(app)
                    .post('/books')
                    .send(testBook);

                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorEmpty('title'));
            });

            it('returns error when author is not provided', async () => {
                testBook.AuthorId = null;
                const response = await request(app)
                    .post('/books')
                    .send(testBook);

                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal("Book.AuthorId cannot be null");
            });

            it('returns error when author is empty', async () => {
                testBook.AuthorId = '  ';
                const response = await request(app)
                    .post('/books')
                    .send(testBook);   
                
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal("Validation notEmpty on AuthorId failed");
            });
        });
    });

    describe('with records in the database', () => {
        let testBooks;
        let testAuthors;
        let testGenres;

        beforeEach(async () => {
            await Book.destroy({ where: {} });
            await Author.destroy({ where: {} });
            await Genre.destroy({ where: {} });
            
            testAuthors = await Promise.all([
                Author.create({ author: 'Matt Haig' }),
                Author.create({ author: 'Kate Ellis' })
            ]);
            
            testGenres = await Promise.all([
                Genre.create({ genre: 'Contemporary Fiction '}),
                Genre.create({ genre: 'Crime and Mystery '})
            ]);

            testBooks = await Promise.all([
                Book.create({
                    title: 'The Midnight Library',
                    ISBN: '978-0-525-55948-1',
                    AuthorId: testAuthors[0].id,
                    GenreId: testGenres[0].id
                }),
                Book.create({
                    title: 'The Stone Chamber',
                    ISBN: '978-0-349-42571-9',
                    AuthorId: testAuthors[1].id,
                    GenreId: testGenres[1].id
                }),
                Book.create({
                    title: 'How To Stop Time',
                    ISBN: '978-0-525-52289-8',
                    AuthorId: testAuthors[0].id,
                    GenreId: testGenres[0].id
                })
            ]);
        });

        describe('POST /books', () => {
            it('add a new book to the existing database', async () => {
                const response = await request(app)
                    .post('/books')
                    .send({
                        title: 'The Humans',
                        ISBN: '978-0-099-12345-2',
                        AuthorId: testAuthors[0].id,
                        GenreId: testGenres[1].id
                    });

                const newBookRecord = await Book.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(201);
                expect(response.body.title).to.equal('The Humans');
                expect(response.body.ISBN).to.equal('978-0-099-12345-2');    

                expect(newBookRecord.title).to.equal('The Humans');
                expect(newBookRecord.ISBN).to.equal('978-0-099-12345-2');                
            });

            it('returns an error if the ISBN already exists', async () => {
                const response = await request(app)
                    .post('/books')
                    .send({
                        title: 'Something else',
                        ISBN: '978-0-525-52289-8',
                        AuthorId: testAuthors[1].id,
                        GenreId: testGenres[0].id
                    });

                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorNotUnique('ISBN'));
            });
        });

        describe('GET /books', () => {
            it('gets all book records', async () => {
                const response = await request(app).get('/books');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((book) => {
                    const expected = testBooks.find((a) => a.id === book.id);

                    expect(expected.title).to.equal(book.title);
                    expect(expected.ISBN).to.equal(book.ISBN);
                });
            });
        });

        describe('GET /books/:id', () => {
            it('gets books record by id', async () => {
                const book = testBooks[0];
                const response = await request(app).get(`/books/${book.id}`);

                expect(response.status).to.equal(200);
                expect(response.body.title).to.equal(book.title);
                expect(response.body.Author.id).to.equal(book.AuthorId);
                expect(response.body.Genre.id).to.equal(book.GenreId);
                expect(response.body.ISBN).to.equal(book.ISBN);
            });

            it('returns a 404 if the book does not exist', async () => {
                const response = await request(app).get('/books/12345');

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('book'));
            });
        });

        describe('PATCH /books/:id', () => {
            it('updates book title by id', async () => {
                const book = testBooks[0];
                const response = await request(app)
                    .patch(`/books/${book.id}`)
                    .send({ title: 'The Midnight Train'});

                const updateBookRecord = await Book.findByPk(book.id, { raw: true });
           
                expect(response.status).to.equal(200);
                expect(updateBookRecord.title).to.equal('The Midnight Train');
            });

            it('updates book GenreId by id', async () => {
                const book = testBooks[0];
                const response = await request(app)
                    .patch(`/books/${book.id}`)
                    .send({ GenreId: testGenres[1].id });
                    
                const updatedBookRecord = await Book.findByPk(book.id, { raw: true });

                expect(response.status).to.equal(200);
                expect(updatedBookRecord.GenreId).to.equal(testGenres[1].id);
            });

            it('returns a 404 if the book does not exist', async () => {
                const response = await request(app)
                    .patch('/books/12345')
                    .send({ genre: 'Some other genre'});

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('book'));
            });
        });

        describe('DELETE /books/:id', () => {
            it('deletes book record by id', async () => {
                const book = testBooks[0];
                const response = await request(app).delete(`/books/${book.id}`);
                const deletedBook = await Book.findByPk(book.id, { raw: true });

                expect(response.status).to.equal(204);
                expect(deletedBook).to.equal(null);
            });

            it('returns a 404 if the book does not exist', async () => {
                const response = await request(app).delete('/books/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('book'));
            });
        });
    });
});