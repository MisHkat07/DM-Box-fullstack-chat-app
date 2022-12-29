import axios from "axios";
import {
  FRIENDS_GET_SUCCESS,
  MESSAGE_GET_SUCCESS,
  MESSAGE_SEND_SUCCESS,
} from "../type/messenger-type";

export const getFriends = async (dispatch) => {
  try {
    const response = await axios.get("/friends");
    dispatch({
      type: FRIENDS_GET_SUCCESS,
      payload: {
        friends: response.data.friends,
      },
    });
  } catch (error) {
    console.log("🎯 error:", error.response.data);
  }
};

export const messageSend = (data) => async (dispatch) => {
  try {
    const response = await axios.post("/text-send", data);
    dispatch({
      type: MESSAGE_SEND_SUCCESS,
      payload: {
        message: response.data.message,
      },
    });
  } catch (error) {
    console.log(error.response.data);
  }
};

export const getMessage = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/get-message/${id}`);
      dispatch({
        type: MESSAGE_GET_SUCCESS,
        payload: {
          message: response.data.message,
        },
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };
};

export const ImageMessageSend = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/image-send`, data);
      dispatch({
        type: MESSAGE_SEND_SUCCESS,
        payload: {
          message: response.data.message,
        },
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };
};

export const seenMessage = (msg) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/seen-message`, msg);
    } catch (error) {
      console.log(error.response.data);
    }
  };
};
 
export const updateMessage = (msg) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/delivered-message`, msg);
      console.log('🎯response', response)
    } catch (error) {
      console.log(error.response.data);
    }
  };
};
 