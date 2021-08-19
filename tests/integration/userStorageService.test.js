import UserStorage from "../../services/userStorage.js";
import User from "../../models/user.js";

test("a once saved user is returned unchanged", async () => {
    const userStorage = new UserStorage();
    const email = "nazar.vinnichuk@email.org";
    const hashedPasswordStub = "$4$2$";
    const user = User.fromEmailAndHashedPassword(email, hashedPasswordStub);

    await userStorage.save(user);
    const returnedUser = await userStorage.get(email);

    expect(returnedUser).toEqual(user);
});

test("null is returned if no user with such email has been saved", async () => {
    const userStorage = new UserStorage();
    const email = "nazar.vinnichuk@email.org";

    const returnedUser = await userStorage.get(email);

    expect(returnedUser).toBe(null);
});

test("a saved user can be updated by another save", async () => {
    const userStorage = new UserStorage();
    const email = "nazar.vinnichuk@email.org";
    const hashedPasswordStub = "$4$2$";
    const user = User.fromEmailAndHashedPassword(email, hashedPasswordStub);
    const newHashedPasswordStub = "$9$9$";
    const newUser = User.fromEmailAndHashedPassword(email, newHashedPasswordStub);

    await userStorage.save(user);
    await userStorage.save(newUser);
    const returnedUser = await userStorage.get(email);

    expect(returnedUser).toEqual(newUser);
});

test("saving another user doesn't override existing ones", async () => {
    const userStorage = new UserStorage();
    const email = "nazar.vinnichuk@email.org";
    const hashedPasswordStub = "$4$2$";
    const user = User.fromEmailAndHashedPassword(email, hashedPasswordStub);
    const anotherEmail = "nazar.vinnichuk@email.ua";
    const anotherHashedPasswordStub = "$9$9$";
    const anotherUser = User.fromEmailAndHashedPassword(
        anotherEmail, anotherHashedPasswordStub
    );

    await userStorage.save(user);
    await userStorage.save(anotherUser);
    const returnedUser = await userStorage.get(email);

    expect(returnedUser).toEqual(user);
});
