import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it('returns ticket for correct input', async () => {
    const cookie = global.signin();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'dfghjkl',
      price: 20,
    })
    .expect(201);
    
    const id = response.body.ticket.id;
    
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(200);
})


it('returns error for incorrect id', async () => {
    
    const id = new mongoose.Types.ObjectId().toHexString();
    
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
})