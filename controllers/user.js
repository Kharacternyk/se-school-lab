import User from "../models/user.js";

export function auth(request, response, next) {
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

export function parse(request, response, next) {
    if (typeof request.body.email != "string" ||
        typeof request.body.password != "string") {
        return response.sendStatus(400);
    }
    request.email = request.body.email;
    request.password = request.body.password;
    next();
}

export async function create(request, response) {
    response.sendStatus(200);
    const user = new User(request.email);
    await user.setPassword(request.password);
}

export async function login(request, response) {
    const user = new User(request.email);
    const token = await user.login(request.password);
    if (token) {
        response.json(token);
    } else {
        response.sendStatus(403);
    }
}
