const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
// Routes for deleteprofile , updateprofile ,getuserdetails , getEnrolledCourse , updateDisplayPicture;

const { auth, isInstructor } = require("../middlewares/auth");
const {
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  // getEnrolledCourses,
  instructorDashboard,
  deleteProfile,
} = require("../controllers/Profile");

// Profile routes                                                    *
router.delete("/deleteProfile", auth, deleteProfile); // Delete User Account
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
// router.get("/getEnrolledCourses", auth, getEnrolledCourses); // Get Enrolled Courses
router.put(
  "/updateDisplayPicture",
  auth,
  upload.single("file"),
  updateDisplayPicture
);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
