import supertest from "supertest";
import { app } from "../../app";
import request from "supertest";
import { natsWrapper } from "../../nats-Wrapper";

it('returns error for not authorized', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).toEqual(401);

});

it('returns 201 for correct input', async () => {
    const cookie = global.signin();
    // console.log(cookie);
    await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'dfghjkl',
      price: 20,
    })
    .expect(201);

})
it('returns error for empty', async () => {
    
    const cookie = global.signin();
    const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({});

    expect(response.status).toEqual(400);

});

it('publishes an event', async () => {
    const cookie = global.signin();
    // console.log(cookie);
    await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'dfghjkl',
      price: 20,
    })
    .expect(201);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})