import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
 // Import Link for navigation
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    let isValid = true;

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    // Validate Password
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Logged in successfully!');
          sessionStorage.setItem('isLoggedIn', true);
          sessionStorage.setItem('userEmail', email);
          navigate('/input');
        } else {
          setLoginError(data.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setLoginError('An error occurred. Please try again later.');
      }
    }
  };
  
  return (
    <div className="main-section">
      <div className="form-container">
        <h2 className="heading__h2">
          <img src="/EMOTUNES/public/musical-note.png" width="50px" alt="Musical Not" /> Emotunes
        </h2>
        <p className="links__p">
          <Link to="/login" style={{ fontWeight: 700 }}>Sign In</Link> | <Link to="/signup">Sign Up</Link>
        </p>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">EMAIL</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
          {emailError && <div className="error">{emailError}</div>}

          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {passwordError && <div className="error">{passwordError}</div>}

          {loginError && <div className="error">{loginError}</div>}

          <button className="button" type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
