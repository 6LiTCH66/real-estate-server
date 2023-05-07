import {Router} from "express";
import UserController from "../controllers/user.controller.js";
import ensureAuthenticated from "../middlewares/auth.middleware.js";

const userRoute = new Router();
const userController = new UserController();


userRoute.post("/add-favourite/:id", ensureAuthenticated, userController.addToFavorite)
userRoute.get("/favourites", ensureAuthenticated, userController.getFavourites)
userRoute.delete("/delete-favourite/:id", ensureAuthenticated, userController.deleteFavourite)

export default userRoute;