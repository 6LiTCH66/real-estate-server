import {Router} from "express";
import AuthController from "../controllers/auth.controller.js";

const authRoutes = new Router();
const authController = new AuthController();


authRoutes.post("/sign-up", authController.sign_up)
authRoutes.post("/sign-in", authController.sign_in)
authRoutes.post("/logout", authController.logout)

export default authRoutes;