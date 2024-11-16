import Home from './Home';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import DeleteAccount from './DeleteAccount.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div style={{ marginTop: '-3.5rem' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />

          {}
          <Route path="/forgot-password" element={<ForgotPassword />} /> {}
          <Route path="/delete-account" element={<DeleteAccount />} /> {}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;