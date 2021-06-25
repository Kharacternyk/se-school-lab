import User from "../../models/user.js";
import {jest} from "@jest/globals";
import * as fs from "fs";
import * as fc from "fast-check";

test("create/login/authenticate a user", () => fc.assert(fc.asyncProperty(
    fc.string({minLength: 1}),
    /* It filters out the email used in the E2E test to avoid a race condition */
    fc.emailAddress().filter(email => email !== "end2end@email.org"),
    fc.string(),
    fc.string(),
    fc.string(),
    async (secret, email, password, fakePassword, fakeToken) => {
        const user = new User(email);
        await user.setPassword(password);

        const token = await user.login(password, secret);
        expect(token).toBeTruthy();
        expect(typeof token).toEqual("string");
        expect(User.authenticate(token, secret).email).toEqual(email);

        if (password !== fakePassword) {
            expect(await user.login(fakePassword, secret)).toBe(null);
        }
        if (token !== fakeToken) {
            expect(User.authenticate(fakeToken, secret)).toBe(null);
        }
    }), {
        examples: [
            /* Exceeds the filename length limit */
            ["a", "a".repeat(300) + "@a.a", "a", "b", "a"]
        ],
        interruptAfterTimeLimit: 4000,
    }
));
