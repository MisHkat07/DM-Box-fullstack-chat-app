import React, { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userLogin } from '../store/actions/auth-action';

const initialState = {
  email: '',
  password: '',
};

const Login = () => {
  const alert = useAlert();
  const { successMessage, error, authenticate } = useSelector(
    (state) => state.auth
  );
  const [userInfo, setUserInfo] = useState(initialState);
  const navigate = useNavigate();
  const { email, password } = userInfo;
  const dispatch = useDispatch();

  useEffect(() => {
    if (authenticate) navigate('/');
    if (successMessage) {
      alert.success(successMessage);
      // dispatch({
      //   type: SUCCESS_MESSAGE_CLEAR,
      // });
    }
    if (error) {
      error.map((err) => alert.error(err));
      // dispatch({
      //   type: ERROR_MESSAGE_CLEAR,
      // });
    }
  }, [successMessage, error]);

  const inputHandle = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };
  const login = (e) => {
    e.preventDefault();
    dispatch(userLogin(userInfo));
  };

  return (
    <div className="login">
      <div className="card">
        <div className="card-header">
          <h3>Login</h3>
        </div>
        <div className="card-body">
          <form onSubmit={login}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                onChange={inputHandle}
                value={email}
                name="email"
                className="form-control"
                id="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                onChange={inputHandle}
                value={password}
                name="password"
                className="form-control"
                id="password"
              />
            </div>
            <div className="form-group">
              <input type="submit" value="Login" className="btn" />
            </div>
            <div className="form-group">
              <span>
                {' '}
                Don't have an account?
                <Link to="/register"> Register</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
