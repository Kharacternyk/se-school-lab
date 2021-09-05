import jwt from "jsonwebtoken";

export default class TokenFactory {
    constructor(secret, options) {
        this.secret = secret;
        this.options = options;
    }

    create(payload) {
        return jwt.sign(payload, this.secret, this.options);
    }

    verify(token) {
        try {
            const payload = jwt.verify(token, this.secret);
            return payload;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return null; 
            } else {
                throw error;
            }
        }
    }
}
