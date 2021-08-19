import App from "./app.js";
import UserStorage from "./services/userStorage.js";
import TokenFactory from "./models/tokenFactory.js";

const port = 8000;
const userStorage = new UserStorage("./private/db");
const tokenFactory = new TokenFactory("JWT_SECRET", { expiresIn: "10m" });
const app = new App(userStorage, tokenFactory);

app.listen(port, () => console.log(`Listening at ${port}…`));
