import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {registerTeacher, getAllEnrollments} from "../controllers/teacher.controller.js"
import {sendNotification , getAllNotifications} from "../controllers/notification.controller.js"
import { deleteVideo, getAllVideos, publishAVideo } from "../controllers/video.controller.js";

const router = Router()

router.route("/register-teacher").post(
    upload.fields([
        {
        name:"avatar",
        maxcount:1
        }
    ]), registerTeacher)

router.route("/get-enrollments").get(getAllEnrollments)

router.route("/notification").post(sendNotification).get(getAllNotifications)

router.route("/videos").post(publishAVideo)
router.route("/:userId/videos").post(getAllVideos)
router.route("/videos/:videoId").post(deleteVideo)


export default router    