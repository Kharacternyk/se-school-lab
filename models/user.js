import jwt from "jsonwebtoken";
import {dirname} from "path";
import * as bcrypt from "bcrypt";
import * as fs from "fs/promises";
import * as emailUtils from "../utils/email.js";

export default class User {
    constructor(email) {
        this.email = email;
        this.dbPath = "./private/db" + emailUtils.fsEscape(email);
    }
    async setPassword(password) {
        const mkdirPromise = fs.mkdir(dirname(this.dbPath), {recursive: true});
        const hashPromise = bcrypt.hash(password, 8);
        await mkdirPromise;
        await fs.writeFile(this.dbPath, await hashPromise);
    }
    async login(password) {
        let hash;
        try {
            hash = await fs.readFile(this.dbPath, {encoding: "UTF-8"});
        } catch (error) {
            if (error.code === "ENOENT") {
                return null;
            }
            throw error;
        }
        if (await bcrypt.compare(password, hash)) {
            const token = jwt.sign({email: this.email}, User.secret, {expiresIn: "600s"});
            return token;
        }
        return null;
    }
    static get secret() {
        if (typeof User._secret === "string") {
            return User._secret;
        }
        throw TypeError("User.secret must be set to a string");
    }
    static set secret(value) {
        if (typeof value === "string") {
            User._secret = value;
        } else {
            throw TypeError("User.secret must be set to a string");
        }
    }
    static authenticate(token) {
        try {
            return new User(jwt.verify(token, User.secret).email);
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return null; 
            } else {
                throw error;
            }
        }
    }
}
