import Router from "Router"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { studentEnroll } from "../controllers/student.controller.js";
import { submitTest } from "../controllers/submitTest.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllNotifications } from "../controllers/notification.controller.js"

const router = Router()

router.route("/student-enroll").post(verifyJWT, studentEnroll)
router.route("/submit-test").post(
    upload.fields([
        {
            name:"attachments"
        }
    ]),
    submitTest)

router.route("/notification").get(getAllNotifications)

export default router