const fs = require("fs");

const User = require("../../models/user.js").User;

fs.rmdirSync("./private/db", {recursive: true});

User.secret = "TEST_SECRET";
const user = new User("ba@bu.bi");
const password = "1948";

test("can add a user", async () => {
    await user.setPassword(password);
});

test("can login", async () => {
    const token = await user.login(password);
    expect(token).toBeTruthy();
});

test("cannot login with a fake password", async () => {
    const fakePasswords = [
        password + password,
        password + " ",
        password.slice(1),
    ];
    for (fakePassword of fakePasswords) {
        const token = await user.login(fakePassword);
        expect(token).toBe(null);
    }
});
