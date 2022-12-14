import React from 'react';
import { positions, transitions, Provider as AlertPrvider } from 'react-alert';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/App';
import './index.css';
import './main.scss';
import store from './store/index';
import alertTemplate from 'react-alert-template-basic';

const root = ReactDOM.createRoot(document.getElementById('root'));

const options = {
  timeout: 5000,
  positions: positions.BOTTOM_CENTER,
  transitons: transitions.SCALE,
};

root.render(
    <Provider store={store}>
      <AlertPrvider template={alertTemplate} {...options}>
        <App />
      </AlertPrvider>
    </Provider>
);
