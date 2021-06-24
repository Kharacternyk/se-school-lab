const User = require("../models/user.js");

exports.auth = (request, response, next) => {
    const auth = request.headers.authorization;
    if (!auth) {
        return response.sendStatus(401);
    }
    const [scheme, token, ...tail] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
        return response.sendStatus(401);
    }
    const user = User.authenticate(token);
    if (user) {
        request.user = user;
        next();
    } else {
        response.sendStatus(403);
    }
}

exports.parse = (request, response, next) => {
    if (typeof request.body.email != "string" ||
        typeof request.body.password != "string") {
        return response.sendStatus(400);
    }
    request.email = request.body.email;
    request.password = request.body.password;
    next();
}

exports.create = async (request, response) => {
    response.sendStatus(200);
    const user = new User(request.email);
    await user.setPassword(request.password);
}

exports.login = async (request, response) => {
    const user = new User(request.email);
    const token = await user.login(request.password);
    if (token) {
        response.json(token);
    } else {
        response.sendStatus(403);
    }
}
