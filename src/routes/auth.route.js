import {Router} from "express";
import AuthController from "../controllers/auth.controller.js";
import passport from "passport";

const authRoutes = new Router();
const authController = new AuthController();


authRoutes.post("/sign-up", authController.sign_up)
authRoutes.post("/sign-in", passport.authenticate("local"), (req, res) => {
    const {password, ...info} = req.user._doc;
    res.status(200).send(info)
})
authRoutes.post("/logout", authController.logout)

export default authRoutes;