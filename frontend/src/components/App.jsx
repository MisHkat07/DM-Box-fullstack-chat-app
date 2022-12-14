import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../App.css';
import ErrorBoundary from './ErrorBoundary';
import Login from './Login';
import Register from './Register';
import Messenger from './Messenger'

function App() {
  return (
      <BrowserRouter>
    <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Messenger />} />
        </Routes>
    </ErrorBoundary>
      </BrowserRouter>
  );
}

export default App;
