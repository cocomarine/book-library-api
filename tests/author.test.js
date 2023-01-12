const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');

describe('/authors', () => {
    before(async () => Author.sequelize.sync());

    describe('with no records in the database', () => {
        describe('POST /authors', () => {

            let testAuthor;

            beforeEach(async () => {
                await Author.destroy({ where: {} });
                testAuthor = {
                    author: 'Matt Haig',
                };
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
                expect(response.body.error).to.equal("author is required");
            });

            it('returns error when author is empty', async () => {
                testAuthor.author = '  ';
                const response = await request(app)
                    .post('/authors')
                    .send(testAuthor);
                
                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal("author cannot be empty");
            });
        });
    });

    describe('with records in the database', () => {
        let authors;

        beforeEach(async () => {
            await Author.destroy({ where: {} });

            authors = await Promise.all([
                Author.create({
                    author: 'Matt Haig'
                }),
                Author.create({
                    author: 'Kate Ellis',
                }),
                Author.create({
                    author: 'Haruki Murakami',
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

                expect(response.body.author).to.equal('Frank Herbert');
                expect(response.status).to.equal(201);
            });

            it('returns an error if the author is not unique', async () => {
                const response = await request(app)
                    .post('/authors')
                    .send({
                        author: 'Matt Haig',
                    });

                expect(response.status).to.equal(400);
                expect(response.body.error).to.equal('author already exists');
            });
        });

        describe('GET /authors', () => {
            it('gets all authors records', async () => {
                const response = await request(app).get('/authors');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((author) => {
                    const expected = authors.find((a) => a.id === author.id);
                     
                    expect(author.author).to.equal(expected.author);
                });
            });
        });

        describe('GET /authors/:id', () => {
            it('gets authors record by id', async () => {
                const author = authors[0];
                const response = await request(app).get(`/authors/${author.id}`);
        
                expect(response.status).to.equal(200);
                expect(response.body.author).to.equal(author.author);
            });

            it('returns a 404 if the Author does not exist', async () => {
                const response = await request(app).get('/authors/12345');
                
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('author does not exist');
            });
        });

        describe('PATCH /authors/:id', () => {
            it('updates authors name by id', async () => {
                const author = authors[0];
                const response = await request(app)
                    .patch(`/authors/${author.id}`)
                    .send({ author: 'some other name' });
                const updateAuthorRecord = await Author.findByPk(author.id, {
                    raw: true,
                });

                expect(response.status).to.equal(200);
                expect(updateAuthorRecord.author).to.equal('some other name')
            });

            it('returns a 404 if the author does not exist', async () => {
                const response = await request(app)
                    .patch('/authors/12345')
                    .send({ author: 'some other name' });

                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('author does not exist');
            });
        });

        describe('DELETE /authors/:id', () => {
            it('deletes author record by id', async () => {
                const author = authors[0];
                const response = await request(app).delete(`/authors/${author.id}`);
                const deletedAuthor = await Author.findByPk(author.id, { raw: true });

                expect(response.status).to.equal(204);
                expect(deletedAuthor).to.equal(null);
            });
      
            it('returns a 404 if the author does not exist', async () => {
                const response = await request(app).delete('/authors/12345');
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('author does not exist');
            });
        });
    });
});