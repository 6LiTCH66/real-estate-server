import jwt from "jsonwebtoken"

const verifyUser = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token){
        return next()
    }

    jwt.verify(token, process.env.JWT_TOKEN, async (error, payload) => {
        if(error){
            return next()
        }
        req.userId = payload.id;
        req.isAgent = payload.isAgent;
        next();
    })
}

export default verifyUser;