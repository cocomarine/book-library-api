const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');

describe('/readers', () => {
    before(async () => Reader.sequelize.sync());

    beforeEach(async () => {
        await Reader.destroy({ where: {} });
    })

    describe('with no records in the database', () => {
        describe('POST /readers', () => {
            it('creates a new reader in the database', async () => {
                const response = await request(app)
                    .post('/readers')
                    .send({
                        name: 'Elizabeth Bennet',
                        email: 'future_ms_darcy@gmail.com',
                });
                
                const newReaderRecord = await Reader.findByPk(response.body.id, { raw: true });

                expect(response.body.name).to.equal('Elizabeth Bennet');
                expect(newReaderRecord.name).to.equal('Elizabeth Bennet');
                expect(newReaderRecord.email).to.equal('future_ms_darcy@gmail.com');
                expect(response.status).to.equal(201);
            });
        });
    });

    describe('with records in the database', () => {
        let readers;

        beforeEach(async () => {
            readers = await Promise.all([
                Reader.create({
                    name: 'Elizabeth Bennet',
                    email: 'future_ms_darcy@gmail.com'
                }),
                Reader.create({
                    name: 'Arya Stark', 
                    email: 'vmorgul@me.com'
                }),
                Reader.create({
                    name:'Lyra Belacqua', 
                    email: 'darknorth123@msn.org',
                })
            ]);
        });

        describe('GET /readers', () => {
            it('gets all readers records', async () => {
                const response = await request(app).get('/readers');

                expect(response.status).to.equal(200);
                expect(response.body.length).to.equal(3);

                response.body.forEach((reader) => {
                    const expected = readers.find((a) => a.id === reader.id);
                     
                    expect(reader.name).to.equal(expected.name);
                    expect(reader.email).to.equal(expected.email);
                });
            });
        });

        describe('GET /readers/:id', () => {
            it('gets readers record by id', async () => {
                const reader = readers[0];
                const response = await request(app).get(`/readers/${reader.id}`);
        
                expect(response.status).to.equal(200);
                expect(response.body.name).to.equal(reader.name);
                expect(response.body.email).to.equal(reader.email);
            });

            it("returns a 404 if the reader doesnt exist", async () => {
                const response = await request(app).get('/readers/12345');
                
                console.log(response.body.error)
                expect(response.status).to.equal(404);
                expect(response.body.error).to.equal('Reader does not exist');
            });
        });

    })
});