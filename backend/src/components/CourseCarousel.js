import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../Styles/CourseCarousel.css';
import { useUser } from '../hooks/userContext';

// Custom arrow components
const NextArrow = (props) => {

    const { className, onClick } = props;
    return (
        <a
            className={`carousel-control-next ${className}`}
            role="button"
            onClick={onClick}
        >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
        </a>
    );
};

const PrevArrow = (props) => {
    const { className, onClick } = props;
    return (
        <a
            className={`carousel-control-prev ${className}`}
            role="button"
            onClick={onClick}
        >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
        </a>
    );
};


const CourseCarousel = ({ tab }) => {
    const { email } = useUser();
    const { userIn,toggleLoginPopup }= useUser();
    const topFunction = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toggleLoginPopup();
  };
    
      

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="home-course-content">
            <Slider {...settings}>
                {tab.map(course => (
                    <div key={course.id} className="home-course-card">
                        <img src={course.image} alt={course.name} className="home-course-image" />
                        <h3>{course.name}</h3>
                        <p>Category: {course.category}</p>
                        <p>Enrolled: {course.enrolled}</p>
                        <div className="home-course-buttons">
                            {userIn ? (
                                <>
                                    <Link to={`/Course/${course.id}`}>
                                        <button className="home-enroll-btn">Enroll Course </button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button className="home-enroll-btn" onClick={topFunction}> Enroll Now</button>
                                </>
                            )
                            }


                            <Link to={`/Course/${course.id}`}>
                                <button className="home-info-btn">More Info</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default CourseCarousel;
