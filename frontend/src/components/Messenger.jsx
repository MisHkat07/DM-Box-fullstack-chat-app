import React, { useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import useSound from "use-sound";
import notificationSound from "../audio/Notification.mp3";
import sentSound from "../audio/sent-sound.mp3";
import {
  SEEN_MESSAGE,
  SOCKET_MESSAGE,
  UPDATE_FRIEND_MESSAGE,
} from "../store/type/messenger-type";
import {
  getFriends,
  getMessage,
  ImageMessageSend,
  messageSend,
  seenMessage,
  updateMessage,
} from "./../store/actions/messenger-action";
import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import Inbox from "./Inbox";
import Nothing from "./Nothing";
import { DELIVER_MESSAGE } from './../store/type/messenger-type';

const Messenger = () => {
  const scrollRef = useRef();
  const socket = useRef();
  const { friends, message, messageSendSuccess } = useSelector(
    (state) => state.messenger
  );
  const { userInfo, authenticate } = useSelector((state) => state.auth);
  const [notifySound] = useSound(notificationSound);
  const [sendingSound] = useSound(sentSound);
  const [currentFriend, setCurrentFriend] = useState("");
  const [activeFriend, setActiveFriend] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketMessage, setScoketMessage] = useState("");
  const [typingMessage, setTypingMessage] = useState("");
  const [emojiShow, setEmojiShow] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authenticate) navigate("/login");
  }, []);

  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    socket.current.on("getMessage", (data) => {
      setScoketMessage(data);
    });
    socket.current.on("getTypingMessage", (data) => {
      setTypingMessage(data);
    });
    socket.current.on("messageSeenRes", msg => {
      dispatch({
        type: SEEN_MESSAGE,
        payload: {
          messageInfo: msg,
        },
      });
    });
    socket.current.on("deliveredMessageRes", (msg) => {
      dispatch({
        type: DELIVER_MESSAGE,
        payload: {
          messageInfo: msg,
        },
      });
    });
  }, []);

  useEffect(() => {
    if (socketMessage && currentFriend) {
      if (
        socketMessage.senderId === currentFriend._id &&
        socketMessage.recieverId === userInfo.id
      ) {
        dispatch({
          type: SOCKET_MESSAGE,
          payload: {
            message: socketMessage,
          },
        });

        dispatch(seenMessage(socketMessage));
        socket.current.emit('messageSeen', socketMessage)
        
      dispatch({
        type: UPDATE_FRIEND_MESSAGE,
        payload: {
          messageInfo: socketMessage,
          status : 'seen'
        },
      });
      }
    }
  }, [currentFriend, dispatch, socketMessage, userInfo.id]);

  useEffect(() => {
    if (
      socketMessage &&
      socketMessage.senderId !== currentFriend._id &&
      socketMessage.recieverId === userInfo.id
    ) {
      notifySound();
      toast.success(`${socketMessage.senderName} sent a New Message`);
      dispatch(updateMessage(socketMessage));
      socket.current.emit("deliveredMessage", socketMessage);
      dispatch({
        type: UPDATE_FRIEND_MESSAGE,
        payload: {
          messageInfo: socketMessage,
          status: "delivered",
        },
      });
    }
  }, [currentFriend._id, notifySound, socketMessage, userInfo.id]);

  useEffect(() => {
    socket.current.emit("addUser", userInfo.id, userInfo);
  }, [userInfo]);

  useEffect(() => {
    socket.current.on("getUser", (users) => {
      const filteredUser = users.filter((user) => user.userID !== userInfo.id);
      setActiveFriend(filteredUser);
    });
  }, [userInfo.id]);

  const inputHandle = (e) => {
    setNewMessage(e.target.value);
    socket.current.emit("typingMessage", {
      senderId: userInfo.id,
      recieverId: currentFriend._id,
      message: e.target.value,
    });
  };

  useEffect(() => {
    if (friends && friends.length > 0) {
      setCurrentFriend(friends[0].friendInfo);
    }
  }, [friends]);

  const sendMessage = (e) => {
    e.preventDefault();

    const data = {
      senderName: userInfo.username,
      recieverId: currentFriend._id,
      message: newMessage ? newMessage : "👋🏼",
    };

    // socket.current.emit("sendMessage", {
    //   senderId: userInfo.id,
    //   senderName: userInfo.username,
    //   recieverId: currentFriend._id,
    //   time: new Date(),
    //   message: {
    //     text: newMessage ? newMessage : "👋🏼",
    //     image: "",
    //   },
    // });
    if ((newMessage && /\S/.test(newMessage)) || !newMessage) {
      dispatch(messageSend(data));
      sendingSound();
    }
    setNewMessage("");
    setEmojiShow(false);
    socket.current.emit("typingMessage", {
      senderId: userInfo.id,
      recieverId: currentFriend._id,
      message: "",
    });
  };

  const emojiHandler = (emoji) => {
    setNewMessage(`${newMessage}` + emoji);
    socket.current.emit("typingMessage", {
      senderId: userInfo.id,
      recieverId: currentFriend._id,
      message: emoji,
    });
  };

  const imageHandle = (e) => {
    e.preventDefault();
    if (e.target.files.length !== 0) {
      const imageName = e.target.files[0].name;
      const newImageName = Date.now() + imageName;
      const formData = new FormData();
      formData.append("senderName", userInfo.username);
      formData.append("recieverId", currentFriend._id);
      formData.append("image", e.target.files[0]);
      formData.append("imageName", newImageName);

      // socket.current.emit("sendMessage", {
      //   senderId: userInfo.id,
      //   senderName: userInfo.username,
      //   recieverId: currentFriend._id,
      //   time: new Date(),
      //   message: {
      //     text: "",
      //     image: newImageName,
      //   },
      // });
      sendingSound();
      dispatch(ImageMessageSend(formData));
    }
  };

  const emojiShowHandler = () => {
    setEmojiShow(!emojiShow);
  };

  useEffect(() => {
    if (messageSendSuccess) {
      socket.current.emit("sendMessage", message[message.length - 1]);
      dispatch({
        type: "UPDATE_FRIEND_MESSAGE",
        payload: {
          messageInfo: message[message.length - 1],
        },
      });
      dispatch({ type: "MESSAGE_SEND_SUCCESS_CLEAR" });
    }
  }, [messageSendSuccess]);

  useEffect(() => {
    dispatch(getFriends);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMessage(currentFriend?._id));
  }, [dispatch, currentFriend?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="messenger">
      <Toaster
        duration={4000}
        position={"top-center"}
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: "13px",
            padding: "13px",
            borderRadius: "50px",
            backgroundImage:
              "radial-gradient( circle farthest-corner at 10% 20%,#41AAC7  0%, #5ef0ce 90% )",
            color: "#000",
          },
        }}
      />
      <div className="row">
        <div className="col-3">
          <div className="left-side">
            <div className="top">
              <div className="image-name">
                <div className="image">
                  <img src={`/image/${userInfo.image}`} alt="img" />
                </div>
                <div className="name">
                  <h4>{userInfo.username}</h4>
                </div>
              </div>
              <div className="icons">
                {" "}
                <div className="icon">
                  <BsThreeDots />
                </div>
                <div className="icon">
                  <FaEdit />
                </div>
              </div>
            </div>
            <div className="friend-search">
              <div className="search">
                <button>
                  <BiSearch />
                </button>
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control"
                />
              </div>
            </div>
            <div className="active-friends">
              {activeFriend && activeFriend.length > 0
                ? activeFriend.map((user) => (
                    <ActiveFriend
                      setCurrentFriend={setCurrentFriend}
                      user={user}
                    />
                  ))
                : ""}
            </div>
            <div className="friends">
              {friends && friends.length > 0
                ? friends.map((friend, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => setCurrentFriend(friend.friendInfo)}
                        className={
                          currentFriend._id === friend.friendInfo._id
                            ? "hover-friend active"
                            : "hover-friend"
                        }
                      >
                        <Friends userInfo={userInfo} friend={friend} />
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        </div>
        {currentFriend ? (
          <Inbox
            message={message}
            typingMessage={typingMessage}
            emojiShow={emojiShow}
            emojiShowHandler={emojiShowHandler}
            activeFriend={activeFriend}
            imageHandle={imageHandle}
            emojiHandler={emojiHandler}
            inputHandle={inputHandle}
            newMessage={newMessage}
            currentFriend={currentFriend}
            sendMessage={sendMessage}
            scrollRef={scrollRef}
          />
        ) : (
          <Nothing />
        )}
      </div>
    </div>
  );
};

export default Messenger;
