import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CategoryCard({ category, icon }) {
  const [isHovered, setIsHovered] = useState(false);

  // Construct the style object based on the hover state
  const cardStyle = {
    ...styles.card,
    color: isHovered ? 'black' : 'black', // Keep text color black
    backgroundColor: isHovered ? 'white' : 'white', // Change background color on hover
    transform: isHovered ? 'scale(1.05)' : 'scale(1)', // Scale on hover
  };

  return (
    <Link
      to={`/Departments/${category}`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
      className='image-style'
        src={icon}
        alt={category}
        width={34}
        height={36}
        style={{ display: 'block', margin: '0 auto' }} // Ensure the image has block display and center it
      />
      <p style={styles.categoryName}>{category}</p>
    </Link>
  );
}

// Internal CSS for CategoryCard
const styles = {
  card: {
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    margin: '20px',
    width: '10%', // Fixed width for consistent sizing
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none', // Remove underline from link
    transition: 'transform 0.3s ease, background-color 0.3s ease', // Ensure transition is applied
  },
  categoryName: {
    width: '100%',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default CategoryCard;
