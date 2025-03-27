import Router from "Router"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { enrollInCourse, getAllVideosStudent, studentEnroll } from "../controllers/student.controller.js";
import { getAllSubmissions, submitTest } from "../controllers/submitTest.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllNotifications } from "../controllers/notification.controller.js"
import { getClassVideos } from "../controllers/video.controller.js";
import {seeScheduledTest, seeScheduledClass, seeScheduledAss} from "../controllers/scheduled.controller.js";

const router = Router()

router.route("/student-enroll").post(verifyJWT, studentEnroll)

router.route("/submit-test/:testId/student/:studentId").post(
    upload.fields([
        {
            name:"file"
        }
    ]),
    submitTest)

router.route("/submissions/:testId").get(getAllSubmissions)    

router.route("/:userId/notification").get(getAllNotifications)

router.route("/videos/fetch-videos").get(getClassVideos)

router.route("/enrollinCourse").post(enrollInCourse)

router.route("/:userId/videos").get(getAllVideosStudent) //Exactly! Your frontend route includes the query parameters ( and ) directly in the  URL. The backend route, defined as , doesn't need to explicitly include these query parameters.
// Instead, the backend route processes those query parameters dynamically using . 



router.route("/scheduled/tests").get(seeScheduledTest)
// router.route("/scheduled/classes").get(seeScheduledClass)
// router.route("/scheduled/assignments").get(seeScheduledAss)


export default router