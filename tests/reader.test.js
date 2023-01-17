const { expect } = require('chai');
const request = require('supertest');
const { Reader, Book, Author, Genre } = require('../src/models');
const { errorNull, errorEmpty, errorNotUnique, errorNotPresent } = require('./helpers');
const app = require('../src/app');

describe('/readers', () => {
    before(async () => Reader.sequelize.sync());

    describe('with no records in the database', () => {
        describe('POST /readers', () => {

            let testReader;

            beforeEach(async () => {
                await Reader.destroy({ where: {} });

                testReader = {
                    name: "Amelia Dolan",
                    email: "miadolan@hotmail.com",
                    password: "PASSWORD123"
                };
            });

            it('creates a new reader in the database', async () => {
                const response = await request(app)
                    .post('/readers')
                    .send(testReader);
                
                const newReaderRecord = await Reader.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(201);
                expect(response.body.name).to.equal('Amelia Dolan');
                expect(response.body.email).to.equal('miadolan@hotmail.com');
                expect(response.body.password).to.equal(undefined);

                expect(newReaderRecord.name).to.equal('Amelia Dolan');
                expect(newReaderRecord.email).to.equal('miadolan@hotmail.com');
                expect(newReaderRecord.password).to.equal('PASSWORD123');
            });

            it('returns error when name is not provided', async () => {
                testReader.name = null;
                const response = await request(app)
                    .post('/readers')
                    .send(testReader);
                
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorNull('name'));
            });

            it('returns error when email is empty', async () => {
                testReader.email = '  ';
                const response = await request(app)
                    .post('/readers')
                    .send(testReader);
                
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorEmpty('email'));
            });

            it('returns erorr when email is in incorrect format', async () => {
                testReader.email = 'abcgmail.com';
                const response = await request(app)
                    .post('/readers')
                    .send(testReader);
                
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal("email is in incorrect format");
            });

            it('returns error when password has 8 or shorter characters', async () => {
                testReader.password = 'abcd';
                const response = await request(app)
                    .post('/readers')
                    .send(testReader);

                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal("password should be longer than 8 characters");
            });
        });
    });

    describe('with records in the database', () => {
        let testAuthor;
        let testGenre;
        let testBook;
        let testReaders;

        beforeEach(async () => {
            await Author.destroy({ where: {} });
            await Genre.destroy({ where: {} });
            await Book.destroy({ where: {} });
            await Reader.destroy({ where: {} });

            testAuthor = await Author.create({ author: 'Matt Haig '});
            testGenre = await Genre.create({ genre: 'Contemporary Fiction '});

            testReaders = await Promise.all([
                Reader.create({
                    name: 'Elizabeth Bennet',
                    email: 'future_ms_darcy@gmail.com',
                    password: 'abcdefghi',
                }),
                Reader.create({
                    name: 'Arya Stark', 
                    email: 'vmorgul@me.com',
                    password: 'ABCDEFGHI',
                })
            ]);

            testBook = await Book.create({
                title: 'The Midnight Library',
                ISBN: '978-0-525-55948-1',
                ReaderId: testReaders[0].id,
                AuthorId: testAuthor.id,
                GenreId: testGenre.id
            });
        });

        describe('POST /readers', () => {
            it('adds a new reader to the existing database', async () => {
                const response = await request(app)
                    .post('/readers')
                    .send({
                        name: "Amelia Dolan",
                        email: "miadolan@hotmail.com",
                        password: "PASSWORD123"
                    });
                
                const newReaderRecord = await Reader.findByPk(response.body.id, { raw: true });

                expect(response.status).to.equal(201);
                expect(response.body.name).to.equal('Amelia Dolan');
                expect(response.body.email).to.equal('miadolan@hotmail.com');
                expect(response.body.password).to.equal(undefined);

                expect(newReaderRecord.name).to.equal('Amelia Dolan');
                expect(newReaderRecord.email).to.equal('miadolan@hotmail.com');
                expect(newReaderRecord.password).to.equal('PASSWORD123');
            });

            it('returns an error if the reader is not unique', async () => {
                const response = await request(app)
                    .post('/readers')
                    .send({
                        name: "Elizabeth Bennet",
                        email: "miadolan@hotmail.com",
                        password: "PASSWORD123"
                    });
                
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal(errorNotUnique('name'));     
            });
        });

        describe('GET /readers', () => {
            it('gets all readers records', async () => {
                const response = await request(app).get('/readers');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(2);

                response.body.forEach((reader) => {
                    const expected = testReaders.find((a) => a.id === reader.id);
                     
                    expect(reader.name).to.equal(expected.name);
                    expect(reader.email).to.equal(expected.email);
                    expect(reader.password).to.equal(undefined);
                });
            });
        });

        describe('GET /readers/:id', () => {
            it('gets readers record by id and associated book information', async () => {
                const reader = testReaders[0];
                const response = await request(app).get(`/readers/${reader.id}`);
        
                expect(response.status).to.equal(200);
                expect(response.body.name).to.equal(reader.name);
                expect(response.body.email).to.equal(reader.email);
                expect(response.body.password).to.equal(undefined);

                expect(response.body.Books[0].id).to.equal(testBook.id);
                expect(response.body.Books[0].title).to.equal(testBook.title);
                expect(response.body.Books[0].ISBN).to.equal(testBook.ISBN);
                expect(response.body.Books[0].ReaderId).to.equal(testBook.ReaderId);
                expect(response.body.Books[0].AuthorId).to.equal(testBook.AuthorId);
                expect(response.body.Books[0].GenreId).to.equal(testBook.GenreId);
            });

            it('returns a 404 if the reader does not exist', async () => {
                const response = await request(app).get('/readers/12345');
                
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('reader'));
            });
        });

        describe('PATCH /readers/:id', () => {
            it('updates readers email by id', async () => {
                const reader = testReaders[0];
                const response = await request(app)
                    .patch(`/readers/${reader.id}`)
                    .send({ email: 'miss_e_bennet@gmail.com' });
                const updatedReaderRecord = await Reader.findByPk(reader.id, {
                    raw: true,
                });

                expect(response.status).to.equal(200);
                expect(updatedReaderRecord.email).to.equal('miss_e_bennet@gmail.com')
            });

            it('returns a 404 if the reader does not exist', async () => {
                const response = await request(app)
                    .patch('/readers/12345')
                    .send({ email: 'some_other_email@gmail.com' });

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('reader'));
            });
        });

        describe('DELETE /readers/:id', () => {
            it('deletes reader record by id', async () => {
                const reader = testReaders[0];
                const response = await request(app).delete(`/readers/${reader.id}`);
                const deletedReader = await Reader.findByPk(reader.id, { raw: true });

                expect(response.status).to.equal(204);
                expect(deletedReader).to.equal(null);
            });
      
            it('returns a 404 if the reader does not exist', async () => {
                const response = await request(app).delete('/readers/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal(errorNotPresent('reader'));
            });
        });
    });
});