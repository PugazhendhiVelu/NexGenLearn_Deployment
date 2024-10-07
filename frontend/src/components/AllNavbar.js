import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../Styles/navbar.css';
import LoginImage from "../assests/loginslide.jpg";
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../hooks/userContext';
const svgFiles = require.context('../assests/Category', false, /\.svg$/);

const Navbar = ({ categoryNames }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isloggedIn, setLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const registerPopupRef = useRef(null);
  const { userIn,loginPopupRef,isLoginPopupVisible,setIsLoginPopupVisible,isRegisterPopupVisible,setIsRegisterPopupVisible,toggleLoginPopup,toggleRegisterPopup, login, logout }
  = useUser();
  const mail = useUser(); 
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('UserToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Optionally, verify the token expiration here
        console.log("User Email:", decodedToken.email);
        setLoggedIn(true);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [formLoginData, setFormLoginData] = useState({
    emailLogin: '',
    passwordLogin: ''
  });

  const { emailLogin, passwordLogin } = formLoginData;
  const { name, email, phone, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setFormLoginData({ ...formLoginData, [e.target.name]: e.target.value });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (loginPopupRef.current && !loginPopupRef.current.contains(event.target)) {
      loginPopupRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsLoginPopupVisible(false);
    }
    if (registerPopupRef.current && !registerPopupRef.current.contains(event.target)) {
      setIsRegisterPopupVisible(false); // Close login popup if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
  };

  const handleCategoryClick = (category) => {
    navigate(`/Departments/${category}`);
    setIsOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://nex-gen-learn-deployment.vercel.app/api/user/register', formData);
      alert('User registered successfully!');
      toggleLoginPopup();
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Try again.');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://nex-gen-learn-deployment.vercel.app/api/user/login', formLoginData);
      const { token } = res.data; // Assuming the response contains the email directly
      localStorage.setItem('UserToken', token);
      setLoggedIn(true);
      login(token)
      try {
        const decodedToken = jwtDecode(token);
        console.log("By jwt decode", decodedToken.email);
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
      }
      alert('Login successful!');
      //navigate('/courses/categories'); // Redirect to dashboard page after login
    } catch (error) {
      console.error('Login failed:', error);

    }
  };
  const handleLogout = async () => {
    localStorage.removeItem('UserToken');
    setLoggedIn(false);
    logout();
    navigate('/');
  }
  return (
    <div className='navbar-top'>
      <a className='navbar-title' href="/">NexGenLearn</a>
      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder='Search any course'
        />
        <button className="search-button" type="submit">
          <FaSearch />
        </button>
      </form>

      <div className="dropdown" ref={dropdownRef}>
        <button
          className="dropdown-button"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={toggleDropdown}
        >
          Explore Courses
        </button>
        {isOpen && (
          <ul className="dropdown-list">
            {categoryNames.map((category, index) => {
              const fileName = svgFiles.keys()[index];
              console.log(fileName);
              if (!fileName) {
                console.error(`No SVG file found for index: ${index}`);
                return null; // Skip rendering if no file is found
              }
              const SvgIcon = svgFiles(fileName); // No need for .default when using require.context
              if (!SvgIcon) {
                console.error(`SVG not found for category: ${category}`);
                return null;
              }

              return (
                <li key={index} onClick={() => handleCategoryClick(category)}>
                  <img className='image-dropdown' src={SvgIcon} alt={category} /> {/* SvgIcon should directly work here */}
                  {category}
                </li>
              );
            })}
          </ul>





        )}
      </div>

      <nav className='navbar-nav'>
        <ul className='navbar-lists'>
          {isloggedIn ? (
            <>
              <Link style={{
                textDecoration: 'none'
              }}
                to="/About">
                <li><a href="#about">About</a></li>
              </Link>
              <Link style={{
                textDecoration: 'none'
              }}
                to="/profile">
                <li><a href="#profile">Profile</a></li>
              </Link>
              <li><a href="#Logout" onClick={handleLogout}>Logout</a></li>
            </>
          ) : (
            <>

              <li>
                <a href="#login" onClick={toggleLoginPopup} >Login</a>
                {isLoginPopupVisible && (
                  <div className='login-user' id='login-popup' ref={loginPopupRef}>
                    <img src={LoginImage} alt="slide image" />
                    <div className="login-card">

                      <h3>Welcome back</h3>
                      <form onSubmit={handleLoginSubmit} className="login">
                        <div>
                          <label htmlFor="email">Email</label>
                          <input type="email" name='emailLogin' value={emailLogin}
                            onChange={handleLoginChange} required />
                        </div>
                        <div>
                          <label htmlFor="password">Password</label>
                          <input type="password" name='passwordLogin' value={passwordLogin}
                            onChange={handleLoginChange} required />
                        </div>
                        <div className='bottom-link-user'>
                          <button type="submit">Login</button>
                          <a href="#register" onClick={toggleRegisterPopup}>Sign-Up</a>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </li>
              <Link style={{
                textDecoration: 'none'
              }}
                to="/About">
                <li><a href="#about">About</a></li>
              </Link>

              <li>
                <a href="#register" onClick={toggleRegisterPopup}>Register</a>
                {isRegisterPopupVisible && (
                  <div className='register-user' id='register-popup' ref={registerPopupRef}>
                    <img src={LoginImage} alt="slide image" />
                    <div className="register-card">

                      <h3>Hello !</h3>
                      <form onSubmit={handleSubmit} className="register">
                        <div>
                          <label htmlFor="name">Name</label>
                          <input type="text" name='name' value={name}
                            onChange={handleChange} required />
                        </div>
                        <div>
                          <label htmlFor="email">Email</label>
                          <input type="email" name='email' value={email}
                            onChange={handleChange} required />
                        </div>
                        <div>
                          <label htmlFor="phno">Phone Number</label>
                          <input type="text" name='phone' value={phone}
                            onChange={handleChange} required />
                        </div>
                        <div>
                          <label htmlFor="password">Password</label>
                          <input type="password" name='password' value={password}
                            onChange={handleChange} required />
                        </div>
                        <div className="bottom-link-user">
                          <button type="submit">Register</button>
                          <a href="#login" onClick={toggleLoginPopup}>Sign-in</a>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;


