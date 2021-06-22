const jwt = require("jsonwebtoken");

function getSecret() {
    return process.env.SE_LAB_SECRET;
}

exports.auth = (request, response, next) => {
    const auth = request.headers.authorization;
    if (!auth) {
        return response.sendStatus(401);
    }
    const [scheme, token, ...tail] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
        return response.sendStatus(401);
    }
    try {
        request.user = jwt.verify(token, getSecret());
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return response.sendStatus(403);
        } else {
            throw error;
        }
    }
}

exports.create = userData => {
    /*TODO*/
}

exports.login = userData => {
    return jwt.sign({email: userData.email}, getSecret(), {expiresIn: "600s"});
}
