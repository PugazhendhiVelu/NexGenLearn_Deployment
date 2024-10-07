import React, { useEffect, useState } from 'react'
import coursesData from '../util/datas';
import CourseCarousel from './CourseCarousel';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../Styles/department.css'
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/userContext';
const categories = [
    'IT',
    'Health',
    'Business',
    'Language',
    'Management',
    'Personal development',
    'Engineering',
    'Sales and Marketing',
    'Art and Design',
    'Finance'
  ];
const Departments = () => {

  const { email } = useUser();
  console.log("Department ",email);
  
    return (
        <div className='main-dept'>
        <h1 style={{
            textAlign:'center'
        }}>Welcome to NexGenLearn Platform </h1>
        {categories.map(category => (
        <div className='sub-dept' key={category}>
          <div className='dept-title'>
          <h2>Learn <strong style={{color:'blue'}}>{category}</strong> courses,</h2>
          <Link to={`/Departments/${category}`}>View all {category} courses</Link>
          </div>
          
          <div className="course-ard">
            <CourseCarousel tab={coursesData[category]} />
          </div>
        </div>
      ))}
    </div>
    )
}

export default Departments