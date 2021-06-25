import User from "../../models/user.js";
import {jest} from "@jest/globals";
import * as fs from "fs";
import * as fc from "fast-check";

fs.rmSync("./private/db", {force: true, recursive: true});

test("can add a user and then login", () => fc.assert(fc.asyncProperty(
    fc.string({minLength: 1}),
    fc.emailAddress(),
    fc.string(),
    fc.string(),
    fc.string(),
    async (secret, email, password, fakePassword, fakeToken) => {
        User.secret = secret;
        const user = new User(email);
        await user.setPassword(password);

        const token = await user.login(password);
        expect(token).toBeTruthy();
        expect(typeof token).toEqual("string");
        expect(User.authenticate(token)).toEqual(user);

        if (password !== fakePassword) {
            expect(await user.login(fakePassword)).toBe(null);
        }
        if (token !== fakeToken) {
            expect(User.authenticate(fakeToken)).toBe(null);
        }
    }), {
        examples: [
            /* Exceeds the filename length limit */
            ["a", "a".repeat(300) + "@a.a", "a", "b", "a"]
        ],
        interruptAfterTimeLimit: 4000,
    }
));
