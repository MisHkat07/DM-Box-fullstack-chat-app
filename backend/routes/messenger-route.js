const {
  getFriends,
  getMessage,
  messageSeen,
  deliveredMsg,
  sendMessageDB,
  sendImageDB,
} = require("../controllers/messenger-controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.get("/friends", authMiddleware, getFriends);
router.post("/text-send", authMiddleware, sendMessageDB);
router.post("/seen-message", authMiddleware, messageSeen);
router.post("/delivered-message", authMiddleware, deliveredMsg);
router.post("/image-send", authMiddleware, sendImageDB);
router.get("/get-message/:id", authMiddleware, getMessage);

module.exports = router;
