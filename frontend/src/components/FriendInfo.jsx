import React from 'react'
import { BsChevronDown } from 'react-icons/bs';

const FriendInfo = ({ FriendInfo, activeFriend }) => {
  const { username, image } = FriendInfo;
  return (
    <div className="friend-info">
      <input type="checkbox" id="gallery" />
      <div className="image-name">
        <div className="image">
          <img src={`/image/${image}`} alt="" />
        </div>
        {activeFriend &&
        activeFriend.length > 0 &&
        activeFriend.some((u) => u.userID === FriendInfo._id) ? (
          <div className="active-user">
            <p>Active</p>
          </div>
        ) : (
          ''
        )}

        <div className="name">
          <h3>{username}</h3>
        </div>
      </div>
      <div className="others">
        <div className="custom-chat">
          <h4>Customize Chat</h4>
          <BsChevronDown />
        </div>
        <div className="custom-chat">
          <h4>Support</h4>
          <BsChevronDown />
        </div>
        <div className="privacy">
          <h4>Privacy & Policy</h4>
          <BsChevronDown />
        </div>
        <div className="chat-media">
          <h4>Media</h4>
          <label htmlFor="gallery">
            <BsChevronDown />
          </label>
        </div>
      </div>
      <div className="gallery">
        <div className="images">
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
          <img src="/image/6420620211109_214904.jpg" alt="" />
        </div>
      </div>
    </div>
  );
};
export default FriendInfo;