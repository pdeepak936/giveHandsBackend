const express = require("express");
const router = express.Router();
const multer = require('multer');
const {
    adminLogin,
    getUserCount,
    getUserByPhoneNumber, 
    blockUser,
    unblockUser,
    getAdminAgentCount,
    poolContest,
    getAllPoolContest,
    getPoolContest,
    deletePoolContest,
    editPoolContest,
    addOrUpdateRankPrice,
    sendToAllUserNotification,
    postNotification,
    searchNotificationByPhoneNumber,
    deleteNotificationByID,
    showNotificationMessage,
    deleteNotificationsByMessage,
    seduleMatchData,
    updateFantasyPoints,
    updatePrize,
    participatedUser,
    getUserTeam,
    liveMatches,
    completedMatches,
    contestUser,
    userWithdrawlRequest,
    aproveWithdrawl,
    allWithdrawl, 
    userWithdrawlRequestByWithdrawlID

} = require("../controller/adminController");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/admin-login", adminLogin);
router.post("/gettotal-user", getUserCount);
router.post("/getuser/:phoneNumber", getUserByPhoneNumber);
router.post("/block-user", blockUser);
router.post("/unblock-user", unblockUser);
router.post("/pool-contest", poolContest);
router.post("/getpool-contest/:match_id", getAllPoolContest);
router.post("/getpool-contest", getPoolContest);
router.post("/delete-pool-contest", deletePoolContest);
router.post("/edit-pool-contest", editPoolContest);
router.post("/pricerank", addOrUpdateRankPrice);
router.post("/notifications/send-to-all", sendToAllUserNotification);
router.post("/notifications", postNotification);
router.post("/searchNotifications", searchNotificationByPhoneNumber);
router.post("/deleteNotificationByID", deleteNotificationByID);
router.post("/showNotificationMessage", showNotificationMessage);
router.post("/deleteMessage", deleteNotificationsByMessage);
router.post("/seduleMatchData", seduleMatchData);
router.post("/updateFantasyPoints", updateFantasyPoints);
router.post("/updatePrize", updatePrize);
router.post("/participatedUser", participatedUser);
router.post("/getUserTeam", getUserTeam);
router.post("/liveMatches", liveMatches);
router.post("/completedMatches", completedMatches);
router.post("/contestUser", contestUser);
router.post("/userWithdrawlRequest", userWithdrawlRequest);
router.post("/aproveWithdrawl", aproveWithdrawl);
router.post("/allWithdrawl", allWithdrawl);
router.post("/userWithdrawlRequestByWithdrawlID", userWithdrawlRequestByWithdrawlID);


module.exports = router;