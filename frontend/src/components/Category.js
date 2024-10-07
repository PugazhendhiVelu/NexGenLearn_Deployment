import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Styles/category.css';
import axios from 'axios';
import thumbnail from '../assests/thumbnail.png';
import { useUser } from '../hooks/userContext';
const Category = () => {
  const { category } = useParams();
  const email = useUser().email;

  
  const [courses, setCourses] = useState([]);
  const [enrolledcourses, setEnrolledCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userIn,toggleLoginPopup }= useUser();
    const topFunction = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toggleLoginPopup();
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`https://nex-gen-learn-deployment.vercel.app/api/courses/department/${category}`);
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [category]);

  useEffect(() => {
    const enrolledCoursesList = async (email) => {
      if (email) {
        try {
          const response = await axios.get(`https://nex-gen-learn-deployment.vercel.app/api/user/allenrolled/${email}`);
          const enrolled = response.data.isEnrolled.reduce((acc, courseId) => {
            acc[courseId] = true;
            return acc;
          }, {});
          setEnrolledCourses(enrolled);
        } catch (error) {
          console.error("Error checking enrollment:", error);
        }
      }
    };
  
    if (userIn) {
      enrolledCoursesList(email);
    } else {
      // Reset enrolled courses when the user is logged out
      setEnrolledCourses({});
    }
  }, [email, userIn]);
  

  const checkEnrollment = async (id) => {
    if (email) {
      try {
        const response = await axios.get(`https://nex-gen-learn-deployment.vercel.app/api/user/enrolled/${email}/${id}`);
        return response.data.isEnrolled;
      } catch (error) {
        console.error("Error checking enrollment:", error);
        return false;
      }
    }
    return false;
  };

  const handleEnroll = async (id) => {
    const enrolled = await checkEnrollment(id);
    if (enrolled) {
      alert("You are already enrolled in this course.");
      return;
    }

    setEnrollLoading(true);
    try {
      const response = await axios.post(`https://nex-gen-learn-deployment.vercel.app/api/user/enroll/${email}/${id}`);
      if (response.data) {
        alert("Enrolled successfully");
        setEnrolledCourses((prev) => ({ ...prev, [id]: true }));
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      setError("Failed to enroll in the course.");
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='main-category'>
      <h1>Welcome to the {category} Department</h1>
      <div className="main-categories-courses">
        {courses.length > 0 ? (
          courses.map(c => (
            <div className="card-course" key={c.id}>
              <div className="image-cover">
                <img src={c?.thumbnail?.url  || thumbnail} alt={c.name} />
              </div>
              <h3>{c.title}</h3>
              <p>Category: {c.category}</p>
              <p>Learners: {c.enrolledCount}</p>

              <div className="home-course-buttons">
                <Link to={`/Course/${c._id}`}>
                  <button className="home-info-btn">More Info</button>
                </Link>
                {enrolledcourses[c._id] ?
                 
                 <Link to={`/Course/${c._id}`}>
                  <button className="home-enroll-btn">Start Course </button>
                  </Link>
                 : 
                 
                <>
                  {userIn ? (
                  <>
                      {/* <Link to={`/Course/${c._id}`}>
                      <button
                        onClick={() => handleEnroll(c._id)}
                        className="home-enroll-btn"
                        disabled={enrollLoading || enrolledcourses[c._id]}
                      >
                      Enroll Now
                      </button>
                      </Link> */}
                      <button
                        onClick={() => handleEnroll(c._id)}
                        className="home-enroll-btn"
                        disabled={enrollLoading || enrolledcourses[c._id]}
                      >
                      Enroll Now
                      </button>
                  </>
              ) : (
                  <>
                      <button className="home-enroll-btn" onClick={topFunction}> Enroll Now</button>
                  </>
              )
              }
                </>
                 }
              </div>
            </div>
          ))
        ) : (
          <p>No courses available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default Category;
