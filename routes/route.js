const express = require("express");
const router = express.Router();
const multer = require('multer');

const { 
    sendMail,
    signUp,
    verifyOTP,
    signIn,
    setPassward
    } = require("../controller/controller");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
    { name: 'pan', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 },
  ]);

router.post("/mail-otp", sendMail);
router.post("/sign-up", signUp);
router.post("/verify-otp", verifyOTP);
router.post("/sign-in", signIn);
router.post("/set-new-passward", setPassward);

// router.post("/upload-pan/:phoneNumber", upload.single('pan'), uploadPan);
// router.post("/upload-aadhar/:phoneNumber", upload.single('aadhar'), uploadAadhar);

module.exports = router;