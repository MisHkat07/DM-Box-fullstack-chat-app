import React from 'react';
import { BsCameraVideoFill } from 'react-icons/bs';
import { HiDotsCircleHorizontal } from 'react-icons/hi';
import { IoIosCall } from 'react-icons/io';
import ErrorBoundary from './ErrorBoundary';
import FriendInfo from './FriendInfo';
import MessageField from './MessageField';
import TypingField from './TypingField';

const Inbox = ({
  message,
  currentFriend,
  inputHandle,
  newMessage,
  sendMessage,
  typingMessage,
  scrollRef,
  emojiHandler,
  imageHandle,
  activeFriend,
  emojiShow,
  emojiShowHandler,
}) => {
  const { username, image } = currentFriend;

  return (
    <div className="col-9">
      <div className="right-side">
        <input type="checkbox" id="dot" />
        <div className="row">
          <div className="col-8">
            <div className="message-box">
              <div className="header">
                <div className="image-name">
                  <div className="image">
                    <img src={`/image/${image}`} alt="" />
                    {activeFriend &&
                    activeFriend.length > 0 &&
                    activeFriend.some((u) => u.userID === currentFriend._id) ? (
                      <div className="active-icon"></div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="name">
                    <h3>{username}</h3>
                  </div>
                </div>
                <div className="icons">
                  <div className="icon">
                    <IoIosCall />
                  </div>
                  <div className="icon">
                    <BsCameraVideoFill />
                  </div>
                  <label htmlFor="dot">
                    <div className="icon">
                      <HiDotsCircleHorizontal />
                    </div>
                  </label>
                </div>
              </div>
              <ErrorBoundary>
                <MessageField
                  message={message}
                  typingMessage={typingMessage}
                  scrollRef={scrollRef}
                  currentFriend={currentFriend}
                />
              </ErrorBoundary>

              <TypingField
                emojiShow={emojiShow}
                emojiShowHandler={emojiShowHandler}
                imageHandle={imageHandle}
                emojiHandler={emojiHandler}
                sendMessage={sendMessage}
                inputHandle={inputHandle}
                newMessage={newMessage}
              />
            </div>
          </div>
          <div className="col-4">
            <FriendInfo
              FriendInfo={currentFriend}
              activeFriend={activeFriend}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
