import {Router} from "express";
import ChatController from "../controllers/chat.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const chatRoutes = new Router();

const chatController = new ChatController();

chatRoutes.post("/create-room", verifyToken, chatController.createRoom)
chatRoutes.get("/get-messages", verifyToken, chatController.getMessages)
chatRoutes.get("/get-rooms", verifyToken, chatController.getRooms)


export default chatRoutes;