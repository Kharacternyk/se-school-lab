import * as bcrypt from "bcrypt";

const HASH_ROUNDS = 8;

export default class User {
    static fromEmailAndHashedPassword(email, hashedPassword) {
        const user = new User();
        user.email = email;
        user.hashedPassword = hashedPassword;
        return user;
    }

    static async fromEmailAndPlainTextPassword(email, plainTextPassword) {
        const hashedPassword = await bcrypt.hash(plainTextPassword, HASH_ROUNDS);
        return User.fromEmailAndHashedPassword(email, hashedPassword);
    }

    async checkPassword(plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.hashedPassword);
    }
}
