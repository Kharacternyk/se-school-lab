import BtcRateService from "../../services/btcRate.js";

test("a numerical value is returned", async () => {
    const btcRateService = new BtcRateService();

    const rate = await btcRateService.btcRate;

    expect(rate).toBeGreaterThan(0);
});
