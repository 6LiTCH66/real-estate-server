import {Router} from "express";
import AuthController from "../controllers/auth.controller.js";

const userRoutes = new Router();
const authController = new AuthController();


userRoutes.post("/sign-up", authController.sign_up)
userRoutes.post("/sign-in", authController.sign_in)
userRoutes.post("/logout", authController.logout)

export default userRoutes;