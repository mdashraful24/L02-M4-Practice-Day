import { Router } from "express";
import { userController } from "./user.controller";
import authProtector from "../../middleware/auth.protected";
import { Role } from "../../../generated/prisma/enums";

const route = Router();


route.post("/register", userController.registerUser);
route.get("/me", authProtector(Role.ADMIN, Role.AUTHOR, Role.USER), userController.getMyProfile);


export const userRoute = route;