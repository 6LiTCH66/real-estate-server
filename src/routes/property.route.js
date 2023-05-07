import {Router} from "express";
import PropertyController from "../controllers/property.controller.js";
import ensureAuthenticated from "../middlewares/auth.middleware.js";

const propertyRoute = new Router();
const propertyController = new PropertyController();


propertyRoute.post("/add-property", ensureAuthenticated, propertyController.createProperty)
propertyRoute.get("/properties", propertyController.getAllProperties)

propertyRoute.get("/single/:id", propertyController.getSingleProperty)
propertyRoute.delete("/delete/:id", ensureAuthenticated, propertyController.deleteProperty)

export default propertyRoute;