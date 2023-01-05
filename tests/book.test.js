const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
    before(async () => Book.sequelize.sync());

    beforeEach(async () => {
        await Book.destroy({ where: {} });
    });

    describe('with no records in the database', () => {
        describe('POST /books', () => {
            it('creates a new book in the database', async () => {
                const response = await request(app)
                    .post('/books')
                    .send({
                        title: 'The Midnight Library',
                        author: 'Matt Haig',
                        genre: 'Contemporary Fiction',
                        ISBN: '978-0-525-55948-1'
                    });
                
                const newBookRecord = await Book.findByPk(response.body.id, { raw: true });
                
                expect(response.body.title).to.equal('The Midnight Library');
                expect(newBookRecord.title).to.equal('The Midnight Library');
                expect(newBookRecord.author).to.equal('Matt Haig');
                expect(newBookRecord.genre).to.equal('Contemporary Fiction');
                expect(newBookRecord.ISBN).to.equal('978-0-525-55948-1');
                expect(response.status).to.equal(201);
            })
        })
    })
})