import Router from "Router"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { studentEnroll } from "../controllers/student.controller.js";
import { submitTest } from "../controllers/submitTest.controller.js";

const router = Router()

router.route("/student-enroll").post(verifyJWT, studentEnroll)
router.route("/submit-test").post(submitTest)

export default router