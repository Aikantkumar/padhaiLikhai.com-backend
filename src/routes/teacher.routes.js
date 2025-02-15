import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {registerTeacher, getAllEnrollments, getAllTeacherProfiles6to8, getTeacherDetails} from "../controllers/teacher.controller.js"
import {sendNotification , getAllNotifications} from "../controllers/notification.controller.js"
import { deleteVideo, getAllVideos, publishAVideo } from "../controllers/video.controller.js";
import { getAllTests } from "../controllers/submitTest.controller.js";
import { setscheduleTasks, scheduleTest, scheduleClass , scheduleAssignments } from "../controllers/scheduled.controller.js";

const router = Router()

router.route("/register-teacher").post(
    upload.fields([
        {
        name:"avatar",
        maxcount:1
        }
    ]), registerTeacher)

router.route("/get-enrollments").get(getAllEnrollments)
router.route("/get-profiles6to8").get(getAllTeacherProfiles6to8)
router.route("/get-teacherdata/:userId").get(getTeacherDetails)

router.route("/:userId/notification").post(sendNotification).get(getAllNotifications)

router.route("/videos").post(
    upload.fields([
        {
        name:"video",
        maxcount:1
        }
    ]), publishAVideo)

router.route("/:userId/videos").post(getAllVideos)
router.route("/videos/:videoId").post(deleteVideo)

router.route("/fetch-tests").get(getAllTests)

router.route("/schedule/test").post(scheduleTest, setscheduleTasks)
router.route("/schedule/class").post(scheduleClass, setscheduleTasks )
router.route("/schedule/assignment").post(scheduleAssignments, setscheduleTasks)


export default router    