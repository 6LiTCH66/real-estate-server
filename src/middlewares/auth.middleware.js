import jwt from "jsonwebtoken"
import createError from "../utils/createError.js";

const verifyToken = (req, res, next) => {
    const token = res.cookie.refreshToken;

    if (!token){
        return next(createError(401, "A token is required for authentication1"))
    }

    jwt.verify(token, process.env.JWT_TOKEN, async (error, payload) => {
        if(error){
            return next(createError(403, "Token is not valid!"))
        }

        req.userId = payload.id;
        res.isAgent = payload.isAgent;
        next();
    })
}

export default verifyToken;