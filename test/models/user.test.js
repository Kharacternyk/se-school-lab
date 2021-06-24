const fs = require("fs");
const fc = require("fast-check");

const User = require("../../models/user.js").User;

fs.rmdirSync("./private/db", {recursive: true});
jest.setTimeout(10000);

test("can add a user and then login", () => fc.assert(fc.asyncProperty(
    fc.string({minLength: 1}),
    fc.emailAddress().filter(email => !email.includes("/")),
    fc.string(),
    fc.string(),
    async (secret, email, password, fakePassword) => {
        fc.pre(password !== fakePassword);

        User.secret = secret;
        const user = new User(email);
        await user.setPassword(password);

        let token = await user.login(password);
        expect(token).toBeTruthy();
        expect(typeof token).toEqual("string");

        token = await user.login(fakePassword);
        expect(token).toBe(null);
    }))
);
