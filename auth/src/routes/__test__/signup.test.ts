import request from "supertest";
import { app } from "../../app";

it("returns 201 on successful signup", async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: "password"
        })
        .expect(201);
});

it("Validation on email", async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtestcom',
            password: "password"
        })
        .expect(400);
})

it("Validation on missing", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: ""
        })
        .expect(400);
    
    return request(app)
        .post('/api/users/signup')
        .send({
            email: '',
            password: "password"
        })
        .expect(400);
})

it("Duplicate", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: "password"
        })
        .expect(201);
    
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: "password"
        })
        .expect(400);
});

it("cookie check", async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: "password"
        })
        .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
});