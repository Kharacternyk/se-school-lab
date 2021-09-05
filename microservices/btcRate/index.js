import App from "./app.js";
import BtcRateService from "./services/btcRate.js";

const port = 8012;
const app = new App(new BtcRateService());

app.listen(port, () => console.log(`Listening at ${port}…`));
