import User from "../../models/user.js";

test("can create a user from email and password", async () => {
    const email = "nazar.vinnichuk@email.org";
    const password = "Jkl;jkl;0";

    const user = await User.fromEmailAndPlainTextPassword(email, password);

    expect(user.email).toEqual(email);
    expect(user.hashedPassword).toBeTruthy();
});

test("comparing the plaintext password with the hashed one yields true", async () => {
    const email = "nazar.vinnichuk@email.org";
    const password = "Jkl;jkl;0";
    const user = await User.fromEmailAndPlainTextPassword(email, password);

    const doPasswordsMatch = await user.checkPassword(password);

    expect(doPasswordsMatch).toBe(true);
});

test("comparing a wrong plaintext password with the hashed one yields false", async () => {
    const email = "nazar.vinnichuk@email.org";
    const password = "Jkl;jkl;0";
    const wrongPassword = "Uiopuiop>";
    const user = await User.fromEmailAndPlainTextPassword(email, password);

    const doPasswordsMatch = await user.checkPassword(wrongPassword);

    expect(doPasswordsMatch).toBe(false);
});
