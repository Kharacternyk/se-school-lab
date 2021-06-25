import app from "./app.js";
import User from "./models/user.js";

User.secret = "DEMO_SECRET";
const port = 8000;

app.listen(port, () => console.log(`Listening at ${port}…`));
