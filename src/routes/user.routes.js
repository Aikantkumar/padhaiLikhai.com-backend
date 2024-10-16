import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const  router = Router()

// this was the route before adding the middleware:-
// router.route("/register").post(registerUser)
// here we have added a middleware "upload" we will use fields in which we have arrays
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1 //no.of avatar files we need
        },
    ]),
    registerUser)

    router.route("/login").post(loginUser)

    
    router.route("/logout").post(verifyJWT, logoutUser)
    router.route("/refresh-token").post(refreshAccessToken)


export default router