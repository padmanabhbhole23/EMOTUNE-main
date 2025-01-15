import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login.jsx';
import Signup from './signup.jsx';
import Input from './input.jsx';
function App() {
  return (
    <Router>
      <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/input" element={<Input />} />
  <Route path="/" element={<Login />} /> 
</Routes>

    </Router>
  );
}

export default App;
