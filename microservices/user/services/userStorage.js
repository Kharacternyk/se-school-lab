import User from "../models/user.js";
import {promises as fs} from "fs";
import {dirname} from "path";
import {tmpdir} from "os";
import {mkdtempSync} from "fs";

export default class UserStorage {
    constructor(dbDir) {
        if (dbDir) {
            this.dbDir = dbDir;
        } else {
            this.dbDir = mkdtempSync(tmpdir() + "/");
        }
    }

    async save(user) {
        const path = this._dbPath(user.email);
        await fs.mkdir(dirname(path), {recursive: true});
        await fs.writeFile(path, user.hashedPassword);
    }

    async get(email) {
        try {
            const hashedPassword = await fs.readFile(this._dbPath(email), {
                encoding: "UTF-8"
            });
            return User.fromEmailAndHashedPassword(email, hashedPassword);
        } catch (error) {
            if (error.code === "ENOENT") {
                return null;
            }
            throw error;
        }
    }

    /* Replaces all occurrences of '/' with '..', which is illegal in email addresses,
     * and breaks the address into directories on filename limit boundaries.
     */
    _dbPath(email) {
        let escaped = email.replace(/[/]/g, "..");
        let path = "";
        while (escaped) {
            path += "/" + escaped.slice(0, 255);
            escaped = escaped.slice(256);
        }
        return this.dbDir + path;
    }
}
