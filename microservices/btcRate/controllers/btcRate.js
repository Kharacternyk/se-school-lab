const btcRate = btcRateService => async (request, response) => {
    const data = {
        rate: await btcRateService.btcRate,
    };
    response.json(data);
}

export default btcRate;
