import { app } from "../../app";
import request from "supertest";
import { Ticket } from "../../models/tickets";

it('returns 201 for correct input', async () => {
    const cookie = global.signin();
    // console.log(cookie);
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'dfghjkl',
      price: 20,
    })
    .expect(201);
    
    const id = response.body.ticket.id;

    const res = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'qwerty',
            price: 30
        })
        .expect(200);
    
    expect(res.body.title).toEqual('qwerty')
    // expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('implements OCC', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123',
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 20 });

    await firstInstance?.save();


    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('OCC not working');
})

it('incements the version', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123',
    });

    await ticket.save();

    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);

    
})