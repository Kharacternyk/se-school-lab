import jwt from "jsonwebtoken";
import {dirname} from "path";
import * as bcrypt from "bcrypt";
import * as fs from "fs/promises";
import * as emailUtils from "../utils/email.js";

export default class User {
    constructor(email) {
        this.email = email;
        this._dbPath = "./private/db" + emailUtils.fsEscape(email);
    }
    async setPassword(password) {
        const mkdirPromise = fs.mkdir(dirname(this._dbPath), {recursive: true});
        const hashPromise = bcrypt.hash(password, 8);
        await mkdirPromise;
        await fs.writeFile(this._dbPath, await hashPromise);
    }
    async login(password, secret) {
        let hash;
        try {
            hash = await fs.readFile(this._dbPath, {encoding: "UTF-8"});
        } catch (error) {
            if (error.code === "ENOENT") {
                return null;
            }
            throw error;
        }
        if (await bcrypt.compare(password, hash)) {
            const token = jwt.sign({email: this.email}, secret, {expiresIn: "600s"});
            return token;
        }
        return null;
    }
    static authenticate(token, secret) {
        try {
            return jwt.verify(token, secret);
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return null; 
            } else {
                throw error;
            }
        }
    }
}
