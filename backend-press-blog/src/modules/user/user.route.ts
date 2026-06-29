import { Router } from "express";
import { userController } from "./user.controller";
import authProtector from "../../middleware/auth.protected";
import { Role } from "../../../generated/prisma/enums";

const route = Router();


route.post("/register", userController.registerUser);
route.get("/me", authProtector(Role.ADMIN, Role.USER), userController.getMyProfile);
route.put("/my-profile", authProtector(Role.ADMIN, Role.USER), userController.updateMyProfile);


export const userRoute = route;