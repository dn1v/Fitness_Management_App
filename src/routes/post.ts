import { Router } from "express";
import { AppRouter } from "./appRouter";
import { Post } from "../models/post";
import { Endpoints } from "../constants/endpoints";
import { Auth } from "../middlewares/auth";
import { Roles } from "../constants/roles";
import { Validation } from "../middlewares/validation";
import { PostController } from "../controllers/post";
import { CreatePostDto } from "../dto/post/createPost.dto";

export class PostRouter extends AppRouter {
    controller: PostController
    constructor() {
        super()
        this.controller = new PostController()
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
    }
}