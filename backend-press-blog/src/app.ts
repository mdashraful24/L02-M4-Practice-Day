import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { userRoute } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import globalErrHandler from "./middleware/global.error.handler";

const app: Application = express();

// Middleware
app.use(cors({
    origin: config.appUrl,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Start all routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
})

// User Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRouter);

// Global Error Handle
app.use(globalErrHandler);


export default app;