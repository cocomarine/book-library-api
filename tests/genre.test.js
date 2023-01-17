const { expect } = require('chai');
const request = require('supertest');
const { Book, Author, Genre } = require('../src/models');
const { errorNull, errorEmpty, errorNotUnique, errorNotPresent } = require('./helpers');
const app = require('../src/app');

describe('/genres', () => {
    before(async () => Genre.sequelize.sync());

    describe('with no records in the database', () => {
        describe('POST /genres', () => {

            let testGenre;

            beforeEach(async () => {
                await Genre.destroy({ where: {} });
                testGenre = { genre: 'Science Fiction' };
            });

            it('creates a new genre in the database', async () => {
                const response = await request(app)
                    .post('/genres')
                    .send(testGenre);
                
                const newGenreRecord = await Genre.findByPk(response.body.id, { raw: true });

                expect(newGenreRecord.genre).to.equal('Science Fiction');
                expect(response.body.genre).to.equal('Science Fiction');
                expect(response.status).to.equal(201);
            });

            it('returns error when genre is not provided', async () => {
                testGenre.genre = null;
                const response = await request(app)
                    .post('/genres')
                    .send(testGenre);
                
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorNull('genre'));
            });

            it('returns error when genre is empty', async () => {
                testGenre.genre = '  ';
                const response = await request(app)
                    .post('/genres')
                    .send(testGenre);
                
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorEmpty('genre'));
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

        describe('POST /genres', () => {
            it('create a new genre int the existing database', async () => {
                const response = await request(app)
                    .post('/genres')
                    .send({
                        genre: 'Science Fiction',
                    });

                const newGenreRecord = await Genre.findByPk(response.body.id, { raw: true });

                expect(response.body.genre).to.equal('Science Fiction');
                expect(response.status).to.equal(201);
                expect(newGenreRecord.genre).to.equal('Science Fiction');
            });

            it('returns an error if the genre is not unique', async () => {
                const response = await request(app)
                    .post('/genres')
                    .send({
                        genre: 'Contemporary Fiction',
                    });

                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorNotUnique('genre'));
            });
        });

        describe('GET /genres', () => {
            it('gets all genres records', async () => {
                const response = await request(app).get('/genres');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(2);

                response.body.forEach((genre) => {
                    const expected = testGenres.find((a) => a.id === genre.id);
                    expect(genre.genre).to.equal(expected.genre);
                });
            });
        });

        describe('GET /genres/:id', () => {
            it('gets genres record by id with associated book information', async () => {
                const genre = testGenres[1];
                const response = await request(app).get(`/genres/${genre.id}`);
        
                expect(response.status).to.equal(200);
                expect(response.body.genre).to.equal(genre.genre);
                expect(response.body.Books[0].id).to.equal(testBooks[1].id);
                expect(response.body.Books[0].title).to.equal(testBooks[1].title);
                expect(response.body.Books[0].ISBN).to.equal(testBooks[1].ISBN);
            });

            it('returns a 404 if the genre does not exist', async () => {
                const response = await request(app).get('/genres/12345');
                
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('genre'));
            });
        });

        describe('PATCH /genres/:id', () => {
            it('updates genres name by id', async () => {
                const genre = testGenres[0];
                const response = await request(app)
                    .patch(`/genres/${genre.id}`)
                    .send({ genre: 'some other name' });
                 const updatedGenreRecord = await Genre.findByPk(genre.id, {
                    raw: true,
                });

                expect(response.status).to.equal(200);
                expect(updatedGenreRecord.genre).to.equal('some other name')
            });

            it('returns a 404 if the genre does not exist', async () => {
                const response = await request(app)
                    .patch('/genres/12345')
                    .send({ genre: 'some other name' });

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('genre'));
            });
        });

        describe('DELETE /genres/:id', () => {
            it('deletes genre record by id', async () => {
                const genre = testGenres[0];
                const response = await request(app).delete(`/genres/${genre.id}`);
                const deletedGenre = await Genre.findByPk(Genre.id, { raw: true });

                expect(response.status).to.equal(204);
                expect(deletedGenre).to.equal(null);
            });
      
            it('returns a 404 if the genre does not exist', async () => {
                const response = await request(app).delete('/genres/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('genre'));
            });
        });
    });
});