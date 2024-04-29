import { Router } from "express";
import { AppRouter } from "./appRouter";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../middlewares/auth";
import { Roles } from "../constants/roles";
import { Validation } from "../middlewares/validation";
import { PostController } from "../controllers/post";
import { CreatePostDto } from "../dto/post/createPost.dto";
import { UpdatePostDto } from "../dto/post/updatePost.dto";
import multer, { Multer } from "multer";

export class PostRouter extends AppRouter {
    controller: PostController
    upload: Multer
    constructor() {
        super()
        this.controller = new PostController()
        this.upload = multer()
    }

    registerRoutes(): Router {
        return super.registerRoutes()
            // PoST management (athlete)
            .post(
                Endpoints.POSTS,
                Auth.authenticate,
                Auth.authorization.bind(Roles.COACH),
                Validation.validateDto(CreatePostDto),
                this.controller.createPost
            )
            .get(
                Endpoints.POSTS_GENERAL,
                Auth.authenticate,
                this.controller.readGeneralPosts
            )
            .get(
                Endpoints.POSTS_GROUP_ID,
                Auth.authenticate,
                this.controller.readGroupPosts
            )
            .get(
                Endpoints.POSTS_POSTID_GROUP_GROUPID,
                Auth.authenticate,
                this.controller.readGroupPost
            )
            .patch(
                Endpoints.POST_POSTID,
                Auth.authenticate,
                Validation.validateDto(UpdatePostDto),
                this.controller.updatePost
            )
            .delete(
                Endpoints.POST_POSTID,
                Auth.authenticate,
                this.controller.deletePost
            )
            .get(
                Endpoints.POSTS_GENERAL_ID,
                Auth.authenticate,
                this.controller.readUserGeneralPost
            )
    }
}