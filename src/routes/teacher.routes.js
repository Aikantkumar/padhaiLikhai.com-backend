import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {registerTeacher, getAllEnrollments, getAllTeacherProfiles6to8, getTeacherDetails, enrollStudent, getAllTeacherProfiles} from "../controllers/teacher.controller.js"
import {sendNotification , getAllNotifications} from "../controllers/notification.controller.js"
import { deleteVideo, getAllVideos, publishAVideo } from "../controllers/video.controller.js";
import { getAllTests } from "../controllers/submitTest.controller.js";
import { setscheduleTasks, scheduleTest, scheduleClass , scheduleAssignments, getAllTestsTeacher } from "../controllers/scheduled.controller.js";

const router = Router()

router.route("/register-teacher").post(
    upload.fields([
        {
        name:"avatar",
        maxcount:1
        }
    ]), registerTeacher)

router.route("/get-enrollments/:userId").get(getAllEnrollments)
router.route("/get-profiles/:item").get(getAllTeacherProfiles)
router.route("/get-teacherdata/:userId").get(getTeacherDetails)
router.route("/getAllEnrollments").get(enrollStudent)

router.route("/:userId/notification").post(sendNotification).get(getAllNotifications)

router.route("/user/:userId/videos").post(
    upload.fields([
        {
        name:"video",
        maxcount:1
        }
    ]), publishAVideo)

router.route("/:userId/videos").post(getAllVideos)
router.route("/videos/:videoId").post(deleteVideo)

router.route("/fetch-tests").get(getAllTests)
router.route("/fetch-tests/:userId").get(getAllTestsTeacher)

router.route("/schedule/test/:userId").post(scheduleTest, setscheduleTasks)
// router.route("/schedule/class").post(scheduleClass, setscheduleTasks )
// router.route("/schedule/assignment").post(scheduleAssignments, setscheduleTasks)


export default router    