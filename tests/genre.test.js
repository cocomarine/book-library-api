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
                testGenre = {
                    genre: 'Science Fiction',
                };
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
        let testGenres;

        beforeEach(async () => {
            await Genre.destroy({ where: {} });

            testGenres = await Promise.all([
                Genre.create({
                    genre: 'Contemporary Fiction',
                }),
                Genre.create({
                    genre: 'Crime and Mistery',
                }),
                Genre.create({
                    genre: 'Memoir',
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
                expect(response.body.length).to.equal(3);

                response.body.forEach((genre) => {
                    const expected = testGenres.find((a) => a.id === genre.id);
                     
                    expect(genre.genre).to.equal(expected.genre);
                });
            });
        });

        describe('GET /genres/:id', () => {
            it('gets genres record by id', async () => {
                const genre = testGenres[0];
                const response = await request(app).get(`/genres/${genre.id}`);
        
                expect(response.status).to.equal(200);
                expect(response.body.genre).to.equal(genre.genre);
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

                const updateGenreRecord = await Genre.findByPk(genre.id, {
                    raw: true,
                });

                expect(response.status).to.equal(200);
                expect(updateGenreRecord.genre).to.equal('some other name')
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