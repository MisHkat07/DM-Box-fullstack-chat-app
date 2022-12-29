const UserModel = require("../models/auth-model");
const messageModel = require("../models/message-model");
const formidable = require("formidable");
const fs = require("fs");

const getLastMessage = async (myId, friendId) => {
  const msg = await messageModel
    .findOne({
      $or: [
        {
          $and: [
            { senderId: { $eq: myId } },
            { recieverId: { $eq: friendId } },
          ],
        },
        {
          $and: [
            { recieverId: { $eq: myId } },
            { senderId: { $eq: friendId } },
          ],
        },
      ],
    })
    .sort({ updatedAt: -1 });
  return msg;
};
module.exports.getFriends = async (req, res) => {
  const myId = req.myId;
  let friend_msg = [];
  try {
    const fetchFriends = await UserModel.find({
      _id: { $ne: myId },
    });
    for (let i = 0; i < fetchFriends.length; i++) {
      let last_msg = await getLastMessage(myId, fetchFriends[i]._id);
      friend_msg = [
        ...friend_msg,
        {
          friendInfo: fetchFriends[i],
          messageInfo: last_msg,
        },
      ];
    }
    // const filteredFriends = fetchFriends.filter((d) => d.id !== myId);
    res.status(200).json({ success: true, friends: friend_msg });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server Error!",
      },
    });
  }
};

module.exports.getMessage = async (req, res) => {
  const friendId = req.params.id;
  const myId = req.myId;
  try {
    let getAllMessage = await messageModel.find({
      $or: [
        {
          $and: [
            { senderId: { $eq: myId } },
            { recieverId: { $eq: friendId } },
          ],
        },
        {
          $and: [
            { recieverId: { $eq: myId } },
            { senderId: { $eq: friendId } },
          ],
        },
      ],
    });
    // getAllMessage = getAllMessage.filter(
    //   (m) =>
    //     (m.senderId === myId && m.recieverId === friendId) ||
    //     (m.recieverId === myId && m.senderId === friendId)
    // );
    res.status(201).json({
      success: true,
      message: getAllMessage,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal server Error!",
      },
    });
  }
};

module.exports.sendMessageDB = async (req, res) => {
  const { senderName, recieverId, message } = req.body;
  const senderId = req.myId;
  try {
    const insertMessage = await messageModel.create({
      senderId,
      senderName,
      recieverId,
      message: {
        text: message,
        image: "",
      },
    });
    res.status(201).json({
      success: true,
      message: insertMessage,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Something went wrong!",
      },
    });
  }
};

module.exports.sendImageDB = async (req, res) => {
  const form = formidable();
  const senderId = req.myId;
  form.parse(req, async (err, fields, files) => {
    const { senderName, recieverId, imageName } = fields;
    const { image } = files;
    image.name = imageName;
    const newPath =
      __dirname + `../../../frontend/public/MessageImage/${imageName}`;
    try {
      fs.copyFile(image.filepath, newPath, async (err) => {
        if (err) {
          console.log("🎯 err:", err);
        } else {
          const insertImage = await messageModel.create({
            senderId,
            senderName,
            recieverId,
            message: {
              text: "",
              image: imageName,
            },
          });
          res.status(201).json({
            success: true,
            message: insertImage,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        error: {
          errorMessage: "Image upload failed!",
        },
      });
    }
  });
};

module.exports.messageSeen = async (req, res) => {
  const messageID = req.body._id;

  await messageModel
    .findByIdAndUpdate({ _id: messageID }, { status: "seen" })
    .then(() => {
      res.json({
        success: true,
      });
    })
    .catch(() => {
      res.status(500).json({
        error: {
          errorMessage: "Internal Server Error!",
        },
      });
    });
};

module.exports.deliveredMsg = async (req, res) => {
  const messageID = req.body._id;

  await messageModel
    .findByIdAndUpdate({ _id: messageID }, { status: "delivered" })
    .then(() => {
      res.json({
        success: true,
      });
    })
    .catch(() => {
      res.status(500).json({
        error: {
          errorMessage: "Internal Server Error!",
        },
      });
    });
};
