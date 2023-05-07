import jwt from "jsonwebtoken"
import createError from "../utils/createError.js";


const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.destroy(()=>{
        res.clearCookie('connect.sid').status(200).send("You are not authenticated");
    });
}

export default ensureAuthenticated;