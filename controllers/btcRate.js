import BtcRateService from "../services/btcRate.js";

const btcRateService = new BtcRateService();

export default async function(request, response) {
    const data = {
        user: request.email,
        rate: await btcRateService.btcRate,
    };
    response.json(data);
}
