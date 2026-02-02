import jwt from "jsonwebtoken";

export const accessTokenMiddleware = (req, res, next) => {

    req.session = { user: null }

    const token = req.cookies.access_token;

    if (!token) return next();

    try {
        req.session.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    }
    catch {}
    next();
}