import React, { useEffect, useState } from 'react'
import BImage from "../assests/intro-image.jpg";
import Board from "../assests/board.png";
import QImage from "../assests/background-image.jpeg";
import { Link } from 'react-router-dom';
import '../Styles/main.css'
import CategoryCard from './CategoryCard';
import CourseCarousel from './CourseCarousel';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useUser } from '../hooks/userContext';


const Main = ({ categoryNames }) => {
  const svgFiles = require.context('../assests/Category', false, /\.svg$/);
  const [activeTab, setActiveTab] = useState('popular');
  const { email } = useUser();
  
  
  const courses = {
    popular: [
      { id: "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Data Science', enrolled: 95, name: 'Data Analysis with Python' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Web Development', enrolled: 150, name: 'JavaScript Essentials' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Data Science', enrolled: 80, name: 'Machine Learning A-Z' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Web Development', enrolled: 200, name: 'HTML & CSS Basics' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Web Development', enrolled: 120, name: 'React for Beginners' },
    ],
    new: [
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Web Development', enrolled: 10, name: 'Next.js for Beginners' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Data Science', enrolled: 5, name: 'Deep Learning with TensorFlow' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Web Development', enrolled: 15, name: 'Vue.js Fundamentals' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Data Science', enrolled: 8, name: 'Data Visualization with R' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Web Development', enrolled: 12, name: 'Sass for Beginners' },
    ],
    free: [
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Web Development', enrolled: 0, name: 'Intro to HTML' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Data Science', enrolled: 0, name: 'Intro to Data Science' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Web Development', enrolled: 0, name: 'CSS Basics' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Data Science', enrolled: 0, name: 'Python for Everybody' },
      { id:  "66de969a3e51f04a4b56b0a1", image: 'https://via.placeholder.com/300x150', category: 'Web Development', enrolled: 0, name: 'JavaScript Basics' },
    ],
  };

  return (
    <div className='main-head'>

      <div className="main-title">
        <h1> Free online courses with certificates </h1>
        <div className='main-search'>
          <input type="text" name="search" placeholder='Search any course' id="search" />
        </div>
        <img src={BImage} alt="intro image" />
      </div>

      <div className="sample-course-card">
        <img src={Board} alt="Board Background image" />
        <h2 className='sample-course-card-h2'>Explore 500+ Free courses</h2>
        <div className='course-card'>
          {categoryNames.length > 0 ? (
            categoryNames.map((category, index) => {
              const fileName = svgFiles.keys()[index]; // Get the filename from the svgFiles context
              if (!fileName) {
                console.error(`No SVG file found for index: ${index}`);
                return null; // Skip rendering if no file is found
              }

              const SvgIcon = svgFiles(fileName); // Load the SVG icon
              if (!SvgIcon) {
                console.error(`SVG not found for category: ${category}`);
                return null; // Skip rendering if SVG not found
              }

              console.log("Main.js ->", category); // Log the current category for debugging
              return (
                <CategoryCard key={category} category={category} icon={SvgIcon} />
              ); // Render the CategoryCard with the icon
            })
          ) : (
            <p>No categories found</p> // Message when no categories are available
          )}
        </div>

      </div>

      <div className='quotes'>
        <img src={QImage} alt="Quotes Image" />
        <div className='BenjaminQuotes'>
          <p><strong>An investment in knowledge pays the best interest</strong> - Benjamin Franklin</p>
          <Link to="/Departments">
            <button>Explore Courses</button>
          </Link>
        </div>
      </div>

      <div className="sliding-courses">
        <div className="course-options">
          <ul>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('popular'); }}
                className={activeTab === 'popular' ? 'active' : ''}
              >
                Popular
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('new'); }}
                className={activeTab === 'new' ? 'active' : ''}
              >
                New
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('free'); }}
                className={activeTab === 'free' ? 'active' : ''}
              >
                Free
              </a>
            </li>
          </ul>
        </div>

        <div className="course-content">
          {activeTab === 'popular' && <CourseCarousel tab={courses.popular} />}
          {activeTab === 'new' && <CourseCarousel tab={courses.new} />}
          {activeTab === 'free' && <CourseCarousel tab={courses.free} />}
        </div>
      </div>



    </div>
  )
}

export default Main











