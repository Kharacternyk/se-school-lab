import User from "./models/user.js";
import btcRate from "./controllers/btcRate.js";
import * as user from "./controllers/user.js";
import express from "express";

/* One would use a longer value with bigger entropy for production.
 * Beware that changing this value invalidates previously handed out tokens. */
User.secret = process.env.SE_LAB_SECRET || "DEMO_SECRET";

const app = express();
const port = process.env.SE_LAB_PORT || 8000;

app.use(express.json());

app.get("/btcRate", user.auth, btcRate);
app.post("/user/create", user.parse, user.create);
app.post("/user/login", user.parse, user.login);
app.use((request, response, next) => response.sendStatus(404));

app.listen(port, () => console.log(`Listening at ${port}…`));
