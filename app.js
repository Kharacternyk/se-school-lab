import btcRate from "./controllers/btcRate.js";
import * as user from "./controllers/user.js";
import express from "express";

export default class App extends express {
    constructor(btcRateService, userStorage, tokenFactory, ...params) {
        super(...params);
        this.use(express.json());
        this.get("/btcRate", user.auth(tokenFactory), btcRate(btcRateService));
        this.post("/user/create", user.parse, user.create(userStorage));
        this.post("/user/login", user.parse, user.login(tokenFactory, userStorage));
        this.use((request, response, next) => response.sendStatus(404));
        this.use((error, request, response, next) =>
            response.status(400).json({error: {message: error.message}}));
    }
}
