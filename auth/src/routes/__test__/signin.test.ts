import request from "supertest";
import { app } from "../../app";

it('fails when not signed up', async() => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: "password"
        })
        .expect(400);
})

it('Incorrect password', async() => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: "password"
        })
        .expect(201);
    
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: "passwor"
        })
        .expect(400);
})