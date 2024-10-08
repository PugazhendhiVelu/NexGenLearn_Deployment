import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Footer.css'; // Import the CSS file for styling

const Footer = () => {
  const year = new Date();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Copyright &copy; {year.getFullYear()} Online Course Platform</p>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="social-media">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  );
};

// Export the Footer component
export default Footer;
