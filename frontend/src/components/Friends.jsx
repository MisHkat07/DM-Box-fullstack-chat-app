import React from "react";
import moment from "moment";

const Friends = ({ friend, userInfo }) => {
  const { friendInfo, messageInfo } = friend;
  return (
    <div className="friend">
      <div className="friend-image">
        <div className="image">
          <img src={`./image/${friendInfo.image}`} alt="" />
        </div>
      </div>
      <div className="friend-name-seen">
        <div className="friend-name">
          <h4 className="fr-name">{friendInfo.username}</h4>
          <div className="message-time">
            {messageInfo?.senderId === userInfo?.id ? (
              <span>You:</span>
            ) : (
              <span>{`${friendInfo.username}:  `}</span>
            )}{" "}
            {messageInfo?.message.text ? (
              <span style={{ color: "#5ed3f080" }}>
                {messageInfo?.message.text.slice(0, 15)}
              </span>
            ) : messageInfo?.message.image ? (
              <span style={{ color: "#5ed3f080" }}>sent a photo </span>
            ) : (
              <span style={{ color: "#5ed3f080" }}>connected </span>
            )}{" "}
            <span>
              {messageInfo
                ? moment(messageInfo.createdAt).startOf("mini").fromNow()
                : moment(friendInfo.createdAt).startOf("mini").fromNow()}
            </span>
          </div>
        </div>
        {userInfo?.id === messageInfo?.senderId ? (
          <div className="seen-unseen-icon">
            <img src={`./image/${friendInfo.image}`} alt="" />
          </div>
        ) : (
          <div className="seen-unseen-icon">
            <div className="seen-icon"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
