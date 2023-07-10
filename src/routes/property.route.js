import {Router} from "express";
import PropertyController from "../controllers/property.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import multer from "multer"
import * as path from "path";

const propertyRoute = new Router();
const propertyController = new PropertyController();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

propertyRoute.post("/add-property", verifyToken, upload.array("images"), propertyController.createProperty)
propertyRoute.get("/properties", propertyController.getAllProperties)

propertyRoute.get("/single/:id", propertyController.getSingleProperty)
propertyRoute.delete("/delete/:id", verifyToken, propertyController.deleteProperty)

export default propertyRoute;