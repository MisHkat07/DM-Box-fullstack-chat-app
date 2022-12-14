import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userRegister } from '../store/actions/auth-action';
import {
  ERROR_MESSAGE_CLEAR,
  SUCCESS_MESSAGE_CLEAR,
} from '../store/type/auth-type';

const initialState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  image: '',
};

const Register = (props) => {
  const alert = useAlert();
  const { loading, successMessage, error, authenticate, userInfo } =
    useSelector((state) => state.auth);

  const navigate = useNavigate();
  useEffect(() => {
    if (authenticate) navigate('/');
    if (successMessage) {
      alert.success(successMessage);
      dispatch({
        type: SUCCESS_MESSAGE_CLEAR,
      });
    }
    if (error) {
      error.map((err) => alert.error(err));
      dispatch({
        type: ERROR_MESSAGE_CLEAR,
      });
    }
  }, [successMessage, error]);

  const [user, setUser] = useState(initialState);
  const [loadImage, setLoadImage] = useState('');

  const { username, email, password, image, confirmPassword } = user;

  const dispatch = useDispatch();
  const inputHandle = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const fileHandle = (e) => {
    if (e.target.value !== 0) {
      setUser({
        ...user,
        [e.target.name]: e.target.files[0],
      });
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLoadImage(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const register = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('image', image);

    dispatch(userRegister(formData));
  };

  return (
    <div className="register">
      <div className="card">
        <div className="card-header">
          <h3>Register</h3>
        </div>
        <div className="card-body">
          <form onSubmit={register}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                onChange={inputHandle}
                name="username"
                value={username}
                className="form-control"
                id="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                onChange={inputHandle}
                name="email"
                value={email}
                className="form-control"
                id="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                onChange={inputHandle}
                name="password"
                value={password}
                className="form-control"
                id="password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                onChange={inputHandle}
                name="confirmPassword"
                value={confirmPassword}
                className="form-control"
                id="confirmPassword"
              />
            </div>
            <div className="form-group">
              <div className="file-image">
                <div className="image">
                  {loadImage ? <img alt="img" src={loadImage} /> : ''}
                </div>
                <div className="file">
                  <label htmlFor="image">Select Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={fileHandle}
                    name="image"
                    id="image"
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <input type="submit" value="Register" className="btn" />
            </div>
            <div className="form-group">
              <span> 
              Already have an acoount?
                <Link to="/login"> Login</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
