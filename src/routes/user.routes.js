import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, getUserChannelProfile } from "../controllers/user.controller.js";
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
    router.route("/change-password").post(verifyJWT, changeCurrentPassword)
    router.route("/current-user").get(verifyJWT, getCurrentUser)
    router.route("/update-account").patch(verifyJWT, updateAccountDetails) //here we are using 'patch' bcz if we use post then every data will get updated
    router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar) //verifyJWT and upload(multer) are the middlewares. we used "single" bcz we are passing only one file 
    router.route("/c/:userName").get(verifyJWT, getUserChannelProfile) //in 'getUserChannelProfile' we are getting the username from "req.params" so we need to write this type of routers. (c means channel here)

export default router