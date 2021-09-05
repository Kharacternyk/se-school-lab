import UserStorage from "../../services/userStorage.js";
import User from "../../models/user.js";
import * as fc from "fast-check";

const userStorage = new UserStorage();
const testOptions = {
    examples: [
        /* Email exceeds the filename length limit */
        ["a".repeat(300) + "@a.a", "a"]
    ],
    interruptAfterTimeLimit: 4000,
}

test("every valid user can be saved and read back", () => fc.assert(fc.asyncProperty(
    fc.emailAddress(),
    fc.string({minLength: 1}),
    async (email, hashedPasswordStub) => {
        const user = User.fromEmailAndHashedPassword(email, hashedPasswordStub);

        await userStorage.save(user);
        const returnedUser = await userStorage.get(email);

        expect(returnedUser).toEqual(user);
    }),
    testOptions
));
