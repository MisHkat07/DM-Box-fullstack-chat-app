const {
  getFriends,
  getMessage,
  sendMessageDB,
  sendImageDB,
} = require("../controllers/messenger-controller");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.get("/friends", authMiddleware, getFriends);
router.post("/text-send", authMiddleware, sendMessageDB);
router.post("/image-send", authMiddleware, sendImageDB);
router.get("/get-message/:id", authMiddleware, getMessage);

module.exports = router;
