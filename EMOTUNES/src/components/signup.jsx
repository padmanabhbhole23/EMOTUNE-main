import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import Link for navigation
import './Login.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate=useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    // Clear previous errors and success message
    setErrors({});
    setSuccessMessage('');

    const newErrors = {};
    let isValid = true;

    // Validate Name
    if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Validate Password
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage(data.message);
          setName('');
          setEmail('');
          setPassword('');
        
          // Save email in session storage and redirect
          sessionStorage.setItem('userEmail', email);
          sessionStorage.setItem('isLoggedIn', true);
        
          alert('Signup successful!');
          navigate('/login');
        } else {
          setErrors({ apiError: data.message });
        }
        
      } catch (error) {
        console.error('Error during signup:', error);
        setErrors({ apiError: 'An error occurred. Please try again later.' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="main-section">
      <div className="form-container">
        <h2 className="heading__h2">
          <img src="EMOTUNES/src/assets/musical-note (1).png" width="50px" alt="Musical Note Icon" /> Emotunes
        </h2>
        <p className="links__p">
  <Link to="/login" style={{ fontWeight: 700 }}>Sign In</Link> | <Link to="/signup">Sign Up</Link>
</p>

        <form onSubmit={handleSignup}>
          <label htmlFor="name">NAME</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
          {errors.name && <div className="error">{errors.name}</div>}

          <label htmlFor="email">EMAIL</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
          {errors.email && <div className="error">{errors.email}</div>}

          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set a strong password"
          />
          {errors.password && <div className="error">{errors.password}</div>}

          {errors.apiError && <div className="error">{errors.apiError}</div>}
          {successMessage && <div className="success">{successMessage}</div>}

          <button className="button" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
