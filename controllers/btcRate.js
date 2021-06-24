const coinpaprika = new (require("@coinpaprika/api-nodejs-client"))();

module.exports = async (request, response) => {
    const rate = (await coinpaprika.getAllTickers({
        coinId: "btc-bitcoin",
        quotes: ["UAH"],
    })).quotes.UAH.price;
    const data = {
        user: request.user,
        rate: rate,
    };
    response.json(data);
}
