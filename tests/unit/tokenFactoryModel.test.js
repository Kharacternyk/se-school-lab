import TokenFactory from "../../models/tokenFactory.js";

test("the payload is returned unchanged", () => {
    const tokenFactory = new TokenFactory("SECRET", {});
    const payload = {
        data: "important data: 0x42",
    };

    const token = tokenFactory.create(payload);
    const verifiedPayload = tokenFactory.verify(token);

    expect(verifiedPayload.data).toEqual(payload.data);
});

test("null is returned when the token expires", () => {
    const options = {
        expiresIn: "0s",
    };
    const tokenFactory = new TokenFactory("SECRET", options);
    const payload = {
        data: "important data: 0x42",
    };

    const token = tokenFactory.create(payload);
    const verifiedPayload = tokenFactory.verify(token);

    expect(verifiedPayload).toBe(null);
});
