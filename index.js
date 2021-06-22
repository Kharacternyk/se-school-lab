const user = require("./user");

const express = require("express");
const app = express();
const port = process.env.SE_LAB_PORT || 8000;

app.use(express.json());

app.get("/btcRate", (request, response) => {
    if (user.isValidToken(request.query.token)) {
        response.send("TODO");
    } else {
        response.status(404).end();
    }
});

app.post("/user/create", (request, response) => {
    user.create(request.body);
    response.end();
});

app.post("/user/login", (request, response) => {
    const data = {
        token: user.login(request.body),
    };
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(data));
});

app.use((request, response, next) => {
    response.status(404).end();
});

app.listen(port, () => console.log(`Listening at ${port}…`));
