import { Router } from "express";
import authProtector from "../../middleware/auth.protected";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = Router();

router.post("/", authProtector(Role.USER, Role.ADMIN), postController.createPost);
router.get("/", authProtector(Role.USER, Role.ADMIN), postController.getAllPosts);
// router.get("/stats", authProtector(Role.ADMIN),);
router.get("/my-posts", authProtector(Role.USER, Role.ADMIN), postController.getMyPost);
// router.get("/:postId",);
router.patch("/:postId", authProtector(Role.USER, Role.ADMIN), postController.updatePost);
router.delete("/:postId", authProtector(Role.USER, Role.ADMIN), postController.deletePost);

export const postRoutes = router;