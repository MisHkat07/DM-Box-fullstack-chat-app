import decodeToken from 'jwt-decode';
import {
  REGISTER_FAILED,
  REGISTER_SUCCESS,
  SUCCESS_MESSAGE_CLEAR,
  ERROR_MESSAGE_CLEAR,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
} from '../type/auth-type';

const authState = {
  loading: true,
  authenticate: false,
  error: '',
  successMessage: '',
  userInfo: '',
};
const tokenDecoder = (token) => {
  const tokenDecoded = decodeToken(token);
  const expireTime = new Date(tokenDecoded.expire * 1000);
  if (new Date() > expireTime) {
    return null;
  } else {
    return tokenDecoded;
  }
};
const getToken = localStorage.getItem('auth-token');

if (getToken) {
  const getInfo = tokenDecoder(getToken);
  if (getInfo) {
    authState.userInfo = getInfo;
    authState.authenticate = true;
    authState.loading = false;
  }
}
export const authReducer = (state = authState, action) => {
  const { payload, type } = action;
  if (type === REGISTER_FAILED || type === LOGIN_FAILED) {
    return {
      ...state,
      error: payload.error,
      authenticate: false,
      userInfo: '',
      loading: true,
    };
  }
  if (type === REGISTER_SUCCESS || type === LOGIN_SUCCESS) {
    const userInfo = tokenDecoder(payload.token);
    return {
      ...state,
      userInfo: userInfo,
      successMessage: payload.successMessage,
      error: '',
      loading: true,
      authenticate: true,
    };
  }
  if (type === SUCCESS_MESSAGE_CLEAR) {
    return {
      ...state,
      successMessage: '',
    };
  }
  if (type === ERROR_MESSAGE_CLEAR) {
    return {
      ...state,
      error: '',
    };
  }
  return state;
};
