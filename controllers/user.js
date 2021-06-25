import User from "../models/user.js";

export const auth = secret => (request, response, next) => {
    const auth = request.headers.authorization;
    if (!auth) {
        return response.sendStatus(401);
    }
    const [scheme, token, ...tail] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
        return response.sendStatus(401);
    }
    const user = User.authenticate(token, secret);
    if (user) {
        request.user = user;
        next();
    } else {
        response.sendStatus(401);
    }
}

export function parse(request, response, next) {
    if (typeof request.body.email != "string" ||
        typeof request.body.password != "string" ||
        request.body.email.length === 0) {
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

export const login = secret => async (request, response) => {
    const user = new User(request.email);
    const token = await user.login(request.password, secret);
    if (token) {
        response.json(token);
    } else {
        response.sendStatus(401);
    }
}
