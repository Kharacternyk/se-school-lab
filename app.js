import User from "./models/user.js";
import btcRate from "./controllers/btcRate.js";
import * as user from "./controllers/user.js";
import express from "express";

const app = express();

app.use(express.json());

app.get("/btcRate", user.auth, btcRate);
app.post("/user/create", user.parse, user.create);
app.post("/user/login", user.parse, user.login);
app.use((request, response, next) => response.sendStatus(404));
app.use((error, request, response, next) =>
        response.status(400).json({error: {message: error.message}}));

export default app;
