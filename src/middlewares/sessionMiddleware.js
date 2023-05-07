import session from "express-session"
import MongoStore from "connect-mongo";

import dotenv from "dotenv"
dotenv.config();

const sessionMiddleware = session({
    secret: process.env.JWT_TOKEN,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONDODB_URL,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        path: '/',
        secure: false,
        httpOnly: true,
        sameSite: true,
    },
});

export default sessionMiddleware;