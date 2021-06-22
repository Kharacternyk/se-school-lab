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

app.post("/user/create", user.parse, user.create);
app.post("/user/login", user.parse, user.login);

app.use((request, response, next) => {
    response.sendStatus(404);
});

app.listen(port, () => console.log(`Listening at ${port}…`));
