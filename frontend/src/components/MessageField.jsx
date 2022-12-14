import React from 'react';
import { useSelector } from 'react-redux';
import Twemoji from 'react-twemoji';

const MessageField = ({ message, currentFriend, scrollRef, typingMessage }) => {
  const { userInfo } = useSelector((state) => state.auth);
  let emoji_regex =
    /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;

  const emo_test = (str) => emoji_regex.test(str);

  return (
    <>
      <div className="msg-show">
        {message && message.length > 0
          ? message.map((msg, index) =>
              msg.senderId === userInfo.id ? (
                <div ref={scrollRef} key={index} className="my-msg">
                  <div className="image-msg">
                    <div className="my-texts">
                      <span className="msg">
                        {msg.message.text !== "" ? (
                          emo_test(msg.message.text) ? (
                            <p id={emo_test(msg.message.text) ? "emo" : ""}>
                              <Twemoji options={{ className: "twemoji" }}>
                                {msg.message.text}
                              </Twemoji>
                            </p>
                          ) : (
                            <p>{msg.message.text}</p>
                          )
                        ) : (
                          <img
                            src={`/MessageImage/${msg.message.image}`}
                            alt="img"
                          />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="msg-time">2 june 2021</div>
                </div>
              ) : (
                <div ref={scrollRef} key={index} className="friend-msg">
                  <div className="image-msg-time">
                    <img src={`./image/${currentFriend.image}`} alt="" />
                    <div className="msg-time">
                      <div className="friend-texts">
                        <span className="msg">
                          {msg.message.text !== "" ? (
                            emo_test(msg.message.text) ? (
                              <p id={emo_test(msg.message.text) ? "emo" : ""}>
                                <Twemoji options={{ className: "twemoji" }}>
                                  {msg.message.text}
                                </Twemoji>
                              </p>
                            ) : (
                              <p>{msg.message.text}</p>
                            )
                          ) : (
                            <img
                              src={`/MessageImage/${msg.message.image}`}
                              alt="img"
                            />
                          )}
                        </span>
                      </div>
                      <div className="msg-time">5 August 2022</div>
                    </div>
                  </div>
                </div>
              )
            )
          : ""}
      </div>

      {typingMessage &&
      typingMessage.message &&
      typingMessage.senderId === currentFriend._id ? (
        <div className="typing-message">
          <div className="friend-msg">
            <div className="typing-field">
              <img src={`./image/${currentFriend.image}`} alt="" />
              <div className="typing-msg">
                <div class="chat-bubble">
                  <div class="typing">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default MessageField;
