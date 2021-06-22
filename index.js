const user = require("./user");

const express = require("express");
const app = express();
const port = process.env.SE_LAB_PORT || 8000;

app.use(express.json());

app.get("/btcRate", user.auth, (request, response) => {
    const data = {
        user: request.user,
        rate: "TODO",
    };
    response.json(data);
});

app.post("/user/create", (request, response) => {
    user.create(request.body);
    response.end();
});

app.post("/user/login", (request, response) => {
    const data = {
        token: user.login(request.body),
    };
    response.json(data);
});

app.use((request, response, next) => {
    response.sendStatus(404);
});

app.listen(port, () => console.log(`Listening at ${port}…`));
