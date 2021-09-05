import btcRate from "./controllers/btcRate.js";
import express from "express";

export default class App extends express {
    constructor(btcRateService, ...params) {
        super(...params);
        this.use(express.json());
        this.get("/btcRate", btcRate(btcRateService));
        this.use((request, response, next) => response.sendStatus(404));
        this.use((error, request, response, next) =>
            response.status(400).json({error: {message: error.message}}));
    }
}
