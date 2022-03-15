process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('../app');
const items = require('../fakeDb');

const candy = { name: "Lollipop", price: "1.29" };

beforeEach(function() {
    items.push(candy);
});

afterEach(function() {
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ items: [candy] });
    });
});

describe("GET /items/:name", () => {
    test("Get a specific item by name", async () => {
        const res = await request(app).get(`/items/${candy.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ name: candy.name, price: candy.price })
    });
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).get('/items/test');
        expect(res.statusCode).toBe(404);
    });
});

describe("POST /items", () => {
    test("Creating an item", async () => {
        const newItem = { name: "Milk", price: "4.99"};
        const res = await request(app).post("/items").send(newItem);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ "added": newItem });
    });
    test("Rsponds with 400 if empty item name/price is passed", async () => {
        const emptyItem = {};
        const res = await request(app).post("/items").send(emptyItem);
        expect(res.statusCode).toBe(400);
    });
});

describe("PATCH /items/:name", () => {
    test("Updating an item", async () => {
        const updatedItem = { name: 'Oat Milk', price: '6.99'};
        const res = await request(app).patch(`/items/${candy.name}`).send(updatedItem);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "updated": { item: updatedItem }});
    });
    test("Responds with 404 for an invalid item", async () => {
        const updatedItem = { name: 'Oat Milk', price: '6.99'};
        const res = await request(app).patch('/items/test').send(updatedItem);
        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", () => {
    test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/${candy.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted!' });
    });
    test("Responds with 404 for an invalid item", async () => {
        const res = await request(app).delete('/items/Chocolate');
        expect(res.statusCode).toBe(404);
    });
});