import {Router} from "express";
import UserController from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import verifyUser from "../middlewares/user.middleware.js";

const userRoute = new Router();
const userController = new UserController();


userRoute.post("/add-favourite/:id", verifyToken, userController.addToFavorite)
userRoute.get("/favourites", verifyToken, userController.getFavourites)
userRoute.delete("/delete-favourite/:id", verifyToken, userController.deleteFavourite)
userRoute.get("/get-user", verifyUser, userController.getUser)

export default userRoute;