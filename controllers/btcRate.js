const btcRate = btcRateService => async (request, response) => {
    const data = {
        user: request.email,
        rate: await btcRateService.btcRate,
    };
    response.json(data);
}

export default btcRate;
