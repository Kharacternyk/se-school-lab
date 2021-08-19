import App from "../app.js";
import UserStorage from "../services/userStorage.js";
import TokenFactory from "../models/tokenFactory.js";
import request from "supertest";

const userStorage = new UserStorage();
const tokenFactory = new TokenFactory("JWT_SECRET", {});
const app = new App(userStorage, tokenFactory);

test("/btcRate is unaccessible without authentication", async () => {
    const response = await request(app).get("/btcRate");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({});
});

const user = {
    email: "end2end@email.org",
    password: "12345678",
};

test("/user/create creates a user", async () => {
    const response = await request(app).post("/user/create").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
});

let token;

test("/user/login hands out a token if and only if the password is right", async () => {
    let response = await request(app).post("/user/login").send({
        ...user,
        password: "87654321",
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({});

    response = await request(app).post("/user/login").send(user);
    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual("string");

    token = response.body;
});

test("/btcRate is accessible with a valid token", async () => {
    const response = await request(app).get("/btcRate").auth(token, {type: "bearer"});
    expect(response.status).toBe(200);
    expect(response.body.rate).toBeGreaterThan(0);
    expect(response.body.user).toEqual(user.email);
});
