import {Router} from "express";
import PropertyController from "../controllers/property.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const propertyRoute = new Router();
const propertyController = new PropertyController();

propertyRoute.post("/add-property", verifyToken, propertyController.createProperty)
propertyRoute.get("/properties", propertyController.getAllProperties)
propertyRoute.get("/property/:id", propertyController.getSingleProperty)
propertyRoute.delete("/delete/:id", verifyToken, propertyController.deleteProperty)

export default propertyRoute;