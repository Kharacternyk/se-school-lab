import User from "../models/user.js";

export const auth = tokenFactory => (request, response, next) => {
    const auth = request.headers.authorization;
    if (!auth) {
        return response.sendStatus(401);
    }
    const [scheme, token, ...tail] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
        return response.sendStatus(401);
    }
    const payload = tokenFactory.verify(token);
    if (payload) {
        request.email = payload.email;
        next();
    } else {
        response.sendStatus(401);
    }
}

export const parse = (request, response, next) => {
    const {email, password} = request.body;
    if (typeof email != "string" ||
        typeof password != "string" ||
        email.length === 0) {
        return response.sendStatus(400);
    }
    request.email = email;
    request.password = password;
    next();
}

export const create = userStorage => async (request, response) => {
    const { email, password } = request;
    const user = await User.fromEmailAndPlainTextPassword(email, password);
    await userStorage.save(user);
    response.sendStatus(200);
}

export const login = (tokenFactory, userStorage) => async (request, response) => {
    const { email, password } = request;
    const user = await userStorage.get(email);
    if (await user.checkPassword(password)) {
        const token = tokenFactory.create({
            email: email,
        });
        response.json(token);
    } else {
        response.sendStatus(401);
    }
}
