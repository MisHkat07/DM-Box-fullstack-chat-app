import axios from 'axios';
import { REGISTER_FAILED, REGISTER_SUCCESS, LOGIN_FAILED,LOGIN_SUCCESS } from '../type/auth-type';

export const userRegister = (data) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post('/register', data, config);
      localStorage.setItem('auth-token', response.data.token);
      dispatch({
        type: REGISTER_SUCCESS,
        payload : {
          successMessage: response.data.successMessage,
          token : response.data.token 
        }
      });
    } catch (error) {
      dispatch({
        type: REGISTER_FAILED,
        payload: {
          error : error.response.data.error.errorMessage
        }
      });
    }
  };
};


export const userLogin = (data) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post('/login', data, config);
      localStorage.setItem('auth-token', response.data.token);
      dispatch({
        type: LOGIN_SUCCESS,
        payload : {
          successMessage: response.data.successMessage,
          token : response.data.token 
        }
      });
    } catch (error) {
      dispatch({
        type: LOGIN_FAILED,
        payload: {
          error : error.response.data.error.errorMessage
        }
      });
    }
  };
};
