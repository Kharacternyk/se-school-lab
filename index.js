const user = require("./user");
const express = require("express");
const coinpaprika = new (require("@coinpaprika/api-nodejs-client"))();

const app = express();
const port = process.env.SE_LAB_PORT || 8000;

/* One would use a longer value with bigger entropy for production.
 * Beware that changing this value invalidates previously handed out tokens. */
const secret = process.env.SE_LAB_SECRET || "DEMO_SECRET";

app.use(express.json());

app.get("/btcRate", user.auth(secret), async (request, response) => {
    const rate = (await coinpaprika.getAllTickers({
        coinId: "btc-bitcoin",
        quotes: ["UAH"],
    })).quotes.UAH.price;
    const data = {
        user: request.user,
        rate: rate,
    };
    response.json(data);
});

app.post("/user/create", user.parse, user.create);
app.post("/user/login", user.parse, user.login(secret));

app.use((request, response, next) => {
    response.sendStatus(404);
});

app.listen(port, () => console.log(`Listening at ${port}…`));
