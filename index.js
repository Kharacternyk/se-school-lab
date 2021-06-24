const User = require("./models/user.js");
/* One would use a longer value with bigger entropy for production.
 * Beware that changing this value invalidates previously handed out tokens. */
User.secret = process.env.SE_LAB_SECRET || "DEMO_SECRET";

const user = require("./controllers/user.js");
const btcRate = require("./controllers/btcRate.js");

const express = require("express");

const app = express();
const port = process.env.SE_LAB_PORT || 8000;

app.use(express.json());

app.get("/btcRate", user.auth, btcRate);
app.post("/user/create", user.parse, user.create);
app.post("/user/login", user.parse, user.login);
app.use((request, response, next) => response.sendStatus(404));

app.listen(port, () => console.log(`Listening at ${port}…`));
