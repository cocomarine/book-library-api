const { expect } = require('chai');
const request = require('supertest');
const { Author, Book, Genre } = require('../src/models');
const { errorNull, errorEmpty, errorNotUnique, errorNotPresent } = require('./helpers');
const app = require('../src/app');

describe('/authors', () => {
    before(async () => Author.sequelize.sync());

    describe('with no records in the database', () => {
        describe('POST /authors', () => {

            let testAuthor;

            beforeEach(async () => {
                await Author.destroy({ where: {} });   
                testAuthor = { author: 'Matt Haig' };
            });

            it('creates a new author in the database', async () => {
                const response = await request(app)
                    .post('/authors')
                    .send(testAuthor);
                
                const newAuthorRecord = await Author.findByPk(response.body.id, { raw: true });

                expect(newAuthorRecord.author).to.equal('Matt Haig');
                expect(response.body.author).to.equal('Matt Haig');
                expect(response.status).to.equal(201);
            });

            it('returns error when author is not provided', async () => {
                testAuthor.author = null;
                const response = await request(app)
                    .post('/authors')
                    .send(testAuthor);
                
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorNull('author'));
            });

            it('returns error when author is empty', async () => {
                testAuthor.author = '  ';
                const response = await request(app)
                    .post('/authors')
                    .send(testAuthor);
                
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorEmpty('author'));
            });
        });
    });

    describe('with records in the database', () => {
        let testAuthors;
        let testBooks;
        let testGenres;

        beforeEach(async () => {
            await Author.destroy({ where: {} });
            await Book.destroy({ where: {} });
            await Genre.destroy({ where: {} });

            testAuthors = await Promise.all([
                Author.create({ author: 'Matt Haig' }),
                Author.create({ author: 'Kate Ellis' }),
                Author.create({ author: 'Haruki Murakami' })
            ]);

            testGenres = await Promise.all([
                Genre.create({ genre: 'Contemporary Fiction' }),
                Genre.create({ genre: 'Crime and Mystery' })
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

        describe('POST /authors', () => {
            it('add a new author to the existing database', async () => {
                const response = await request(app)
                    .post('/authors')
                    .send({
                        author: 'Frank Herbert',
                    });

                const newAuthorRecord = await Author.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(201);
                expect(response.body.author).to.equal('Frank Herbert');
                expect(newAuthorRecord.author).to.equal('Frank Herbert');
            });

            it('returns an error if the author is not unique', async () => {
                const response = await request(app)
                    .post('/authors')
                    .send({
                        author: 'Matt Haig',
                    });

                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorNotUnique('author'));
            });
        });

        describe('GET /authors', () => {
            it('gets all authors records', async () => {
                const response = await request(app).get('/authors');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((author) => {
                    const expected = testAuthors.find((a) => a.id === author.id);
                    expect(author.author).to.equal(expected.author);
                });
            });
        });

        describe('GET /authors/:id', () => {
            it('gets authors record by id with associated book information', async () => {
                const author = testAuthors[1];
                const response = await request(app).get(`/authors/${author.id}`);
        
                expect(response.status).to.equal(200);
                expect(response.body.author).to.equal(author.author);
                expect(response.body.Books[0].id).to.equal(testBooks[1].id);
                expect(response.body.Books[0].title).to.equal(testBooks[1].title);
                expect(response.body.Books[0].ISBN).to.equal(testBooks[1].ISBN);
            });

            it('returns a 404 if the Author does not exist', async () => {
                const response = await request(app).get('/authors/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('author'));
            });
        });

        describe('PATCH /authors/:id', () => {
            it('updates authors name by id', async () => {
                const author = testAuthors[0];
                const response = await request(app)
                    .patch(`/authors/${author.id}`)
                    .send({ author: 'some other name' });
                const updatedAuthorRecord = await Author.findByPk(author.id, {
                    raw: true,
                });

                expect(response.status).to.equal(200);
                expect(updatedAuthorRecord.author).to.equal('some other name')
            });

            it('returns a 404 if the author does not exist', async () => {
                const response = await request(app)
                    .patch('/authors/12345')
                    .send({ author: 'some other name' });

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('author'));
            });
        });

        describe('DELETE /authors/:id', () => {
            it('deletes author record by id', async () => {
                const author = testAuthors[0];
                const response = await request(app).delete(`/authors/${author.id}`);
                const deletedAuthor = await Author.findByPk(author.id, { raw: true });

                expect(response.status).to.equal(204);
                expect(deletedAuthor).to.equal(null);
            });
      
            it('returns a 404 if the author does not exist', async () => {
                const response = await request(app).delete('/authors/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('author'));
            });
        });
    });
});