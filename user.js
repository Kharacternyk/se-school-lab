const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const crypto = require("crypto");

exports.auth = secret => (request, response, next) => {
    const auth = request.headers.authorization;
    if (!auth) {
        return response.sendStatus(401);
    }
    const [scheme, token, ...tail] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
        return response.sendStatus(401);
    }
    try {
        request.user = jwt.verify(token, secret);
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return response.sendStatus(403);
        } else {
            throw error;
        }
    }
}

exports.parse = (request, response, next) => {
    if ((typeof request.body.email) != "string" ||
        (typeof request.body.password) != "string") {
        return response.sendStatus(400);
    }
    request.email = request.body.email;
    request.password = request.body.password;
    next();
}

exports.create = async (request, response) => {
    response.sendStatus(200);
    const mkdirPromise = fs.mkdir("./private/db", {recursive: true});
    const hashPromise = bcrypt.hash(request.password, 8);
    await mkdirPromise;
    await fs.writeFile(`./private/db/${request.email}`, await hashPromise);
}

exports.login = secret => async (request, response) => {
    let hash;
    try {
        hash = await fs.readFile(`./private/db/${request.email}`, {encoding: "UTF-8"});
    } catch (error) {
        if (error.code === "ENOENT") {
            return response.sendStatus(403);
        }
        throw error;
    }
    if (await bcrypt.compare(request.password, hash)) {
        const token = jwt.sign({email: request.email}, secret, {expiresIn: "600s"});
        response.json(token);
    } else {
        response.sendStatus(403);
    }
}
