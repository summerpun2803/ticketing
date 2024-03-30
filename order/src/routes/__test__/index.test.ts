import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";


const buildTicket = async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
    });
  
    await ticket.save();
  
    return ticket;
};
  
it('fetches orders for user', async () => {
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();
  
    const userOne = global.signin();
    const userTwo = global.signin();
  
    await request(app)
      .post('/api/order')
      .set('Cookie', userOne)
      .send({
        ticketId: ticketOne.id,
      })
      .expect(201);
  
    await request(app)
      .post('/api/order')
      .set('Cookie', userTwo)
      .send({
        ticketId: ticketTwo.id,
      })
      .expect(201);
  
    await request(app)
      .post('/api/order')
      .set('Cookie', userTwo)
      .send({
        ticketId: ticketThree.id,
      })
      .expect(201);
  
    const response = await request(app)
        .get('/api/order')
        .set('Cookie', userTwo)
        .expect(200);
    
    expect(response.body.length).toEqual(2);
  
})