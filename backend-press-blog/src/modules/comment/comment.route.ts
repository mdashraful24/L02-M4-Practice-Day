import { Router } from "express";
import authProtector from "../../middleware/auth.protected";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// router.post("/", authProtector(Role.USER, Role.ADMIN),);
// router.get("/author/authorId",);
// router.get("/:commentId",);
// router.patch("/:commentId", authProtector(Role.USER, Role.ADMIN),);
// router.delete("/:commentId", authProtector(Role.USER, Role.ADMIN),);
// router.patch("/:commentId/moderate", authProtector(Role.ADMIN),);

export const commentRoutes = router;