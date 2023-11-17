//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.DATABASE = 'mongodb://localhost:27017/tier-service-test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from "mongoose";
import server from '../src/main';
import testOrders from "./testOrders.json";

chai.use(chaiHttp);

describe('order test', () => {
    it('new order test', async () => {
        for (let i = 0; i < testOrders.length; i++) {
            await chai.request(server)
                .post('/api/newOrder').send(testOrders[i]);
        }
    });

    it('get customers test', async () => {
        var res = await chai.request(server)
            .get('/api/customers').send();
        console.log("customers", res.body);
    });

    it('get tier test', async () => {
        var res = await chai.request(server)
            .get('/api/tier').send({ customerId: 2 });
        console.log("tier", res.body);
    });

    it('get orders test', async () => {
        var res = await chai.request(server)
            .get('/api/orders').send({
                customerId: 2,
                page_number: 1,
                page_size: 5
            });
        console.log("orders", res.body);
    });

    it('remove database', async () => {
        /* Connect to the DB */
        await mongoose.connect(process.env.DATABASE || "");
        mongoose.connection.db.dropDatabase();
        console.log("db dropped")
    })
});