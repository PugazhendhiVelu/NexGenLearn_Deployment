

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Course.css'
import { useUser } from '../hooks/userContext';
import thumbnail from '../assests/thumbnail.png';
import Quiz from './Quiz';
/* import CertificatePage from './CertificatePage'; */

function Course() {
  const navigate = useNavigate();
  const email = useUser().email;
  const id = useParams().id; // Get the course ID from the URL 66de969a3e51f04a4b56b0a1  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false); // Track enrollment status
  const [enrollLoading, setEnrollLoading] = useState(false); // Track enrollment loading state
  const [error, setError] = useState(null); // Track errors
  // Get the user's email from context
  const [lessonStatuses, setLessonStatuses] = useState({}); // Track t  he lesson completion statuses
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  const [testpass, settestpass] = useState(false);
  const [testBool, settestBool] = useState(false);

  const [courseAmount, setCourseAmount] = useState();
  const [InstructorName, SetInstructorName] = useState(null);
  const [name, setName] = useState(null);
  const [certificate, setCertificate] = useState(true);
  const { userIn,toggleLoginPopup }= useUser();
  const topFunction = () => {
  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });
  toggleLoginPopup();
};
  



  // Define fetchCourse inside the component
  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
      setCourse(response.data.course);
      SetInstructorName(response.data.InstructorName)
      // Assuming response.data contains the course details
      setLoading(false);

      if (response.data.course && response.data.course.price !== undefined) {
        setCourseAmount(response.data.course.price != 0 ? true : false);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      setLoading(false);
      setError("Failed to load course details.");
    }
  };

  // Define fetchStatuses inside the component
  const fetchStatuses = async (lessons) => {
    const statuses = {};
    try {
      for (let lesson of lessons) {
        const response = await axios.get(`http://localhost:5000/api/user/${email}/course/${id}/lesson/${lesson._id}`);
        statuses[lesson._id] = response.data.status; // Assuming response.data.completed is a boolean

      }
      setLessonStatuses(statuses);
      checkAllLessonsCompleted(statuses);
    } catch (error) {
      console.error("Error fetching lesson statuses:", error);
    }
  };
  const checkAllLessonsCompleted = (statuses) => {
    const allCompleted = Object.values(statuses).every(status => status === 'completed');
    setAllLessonsCompleted(allCompleted);
  };

  useEffect(() => {
    fetchCourse();
    if (email) {
      checkEnrollment();
    }
  }, [id, email]);

  useEffect(() => {
    if (course && course.lessons && isEnrolled) {
      fetchStatuses(course.lessons);
    }
  }, [course, isEnrolled]);

  const checkEnrollment = async () => {
    if (email) {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/enrolled/${email}/${id}`);
        setName(response.data.name);
        setIsEnrolled(response.data.isEnrolled);
      } catch (error) {
        console.error("Error checking enrollment:", error);
        setIsEnrolled(false);
        /* setError("Failed to check enrollment status."); */
      }
    }
  };

  useEffect(() => {
    if (name) {
      console.log("Username ", name);
    }
  }, [name]);

  const handleEnroll = async () => {
    setEnrollLoading(true); // Set loading state for enrollment
    try {
      const response = await axios.post(`http://localhost:5000/api/user/enroll/${email}/${id}`);
      if (response.data) {
        console.log(courseAmount)
        if (courseAmount) {
          alert("Sign-Up bonus you will avail this course for free !!!")

        }
        else {
          alert("Enrolled successfully");
        }
        setIsEnrolled(true);
        fetchCourse();
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      setError("Failed to enroll in the course.");
    } finally {
      setEnrollLoading(false); // Reset loading state
    }
  };
  let bool = true;
  let date;
  const getCertificate = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/check/certificate/${email}/${id}`);
      bool = response.data.status;
      date = response.data.date;
    } catch (error) {
      console.log("Error while the certificate");
    }
  };

  const handleCertificate = async () => {

    await getCertificate();
    if (!bool) {
      date = new Date();
      try {
        alert("Your certificate will be send to your e-mail within 1hour")
        const response = await axios.post(`http://localhost:5000/api/user/set/certificate/${email}/${id}/${course.title}/${InstructorName}`);
      } catch (error) {
        console.log("Error while adding the certificate to the user's account")
      }
    }
    navigate(`/certificate?name=${encodeURIComponent(name)}&course=${encodeURIComponent(course.title)}&instructor=${encodeURIComponent(InstructorName)}&date=${encodeURIComponent(new Date(date).toLocaleDateString())}`);
  };

 

  useEffect(()=>{
    const checkTest = (async()=>{
      try{
        console.log("Hello");
        console.log("Email from checktest",email);
        const response = await axios.get(`http://localhost:5000/api/user/check/quiz/${email}/${id}`);
        console.log("Email and Id ", email , id);
        
        console.log("Response of check test",response);
        
        if(response.data.status){
          settestpass(true);
          console.log("Response of check testpasss");
        }else{
          console.log("Response of check else");
          if(!response.data.present){
            settestBool =false; 
            console.log("Response of check testbool");
          }
        }
      }catch(error){
        console.log("Error while checking the assessment status of the course");
      }
    })
    checkTest();
  }, [email , id])
  const handleTest =(async()=>{
    //await checkTest ();

    if(!testBool){
      {/* <Quiz courseId={id} /> */}
      console.log("Boolean value of inside ",testBool);
    }
    const tempid ='66de969a3e51f04a4b56b0a1'
    console.log("Boolean value of test ",testBool);
    navigate(`/quiz/user/${email}/${id}`);
  })
  const [activeTab, setActiveTab] = useState('modules');
  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length <= wordLimit) {
      return description; // Return the full description if it's within the limit
    }
    return words.slice(0, wordLimit).join(' ') + '...'; // Truncate and add ellipsis
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p >{error}</p>;
  return (
    <div className="course-main-page">
      <div className="side-contents">
        <div className="side-card">
          <div className="side-image-cover">
          <img src={course?.thumbnail?.url  || thumbnail} alt={course.title} width={300} height={180}/>
          </div>
          <h3> {course.title}</h3>
          <p>Category: {course.category}</p>
          <p>Learners: {course.enrolledCount}</p>
          {isEnrolled ?(
            allLessonsCompleted ?(
              testpass ? (
                <button className="home-certificate-button" onClick={handleCertificate} >Get Certificate</button>
              ) : (
                <>
                  <button className="home-start-button" onClick={handleTest} >Take Test</button>
                </>
              )
            ) : (
              <button className="home-start-button">Start Course</button>
            )
          ) : (
           <>
             { userIn ? (
                <>
                <button
          onClick={handleEnroll}
          disabled={enrollLoading}
          className="home-en-button"
        >
          {enrollLoading
            ? 'Enrolling...'
            : courseAmount
              ? `Enroll Now  $ ${course.price}`
              : 'Enroll Now For Free !!'}
        </button>
                </>
            ) : (
<>
<button className="home-enroll-btn" onClick={topFunction}> Enroll Now</button>

</>
            )}
           </>

          /* <button className="home-enroll-button">Enroll Now</button> */
          )}
        </div>
      </div>
      <div className="course-contents">
        <section className='title-course'>
          <h1>{course.title}</h1>
        </section >
        <section className='top-section'>
          <section className='learnerscount'>
            <h4>Learners : </h4>
            <h4>{course.enrolledCount}</h4>
          </section>
          <section className="instructor-course">
            <h4>Author : </h4>
            <h4>{InstructorName}</h4>
          </section>
        </section>

        <section className='description-course'>
          <h4>Short Description about this course : </h4>
          <p>{truncateDescription(course.description, 100)}</p>
        </section>
        <div className="options">
          <ul>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('modules'); }}
                className={activeTab === 'modules' ? 'active' : ''}
              >
                Course Modules
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('Description'); }}
                className={activeTab === 'Description' ? 'active' : ''}
              >
                Description
              </a>
            </li>
            
          </ul>
        </div>

        <div className="contents" >
          {activeTab === 'modules' && (
            
          <div className = "lessonContainer" >
            <h4>Modules : </h4>
            { course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, index) => (
                  <div key={index} className="lessonItem">
                    <div className="lessonContent">
                      <h2 className="lessonTitle">{lesson.name}</h2>
                      {isEnrolled ? (
                      <>
                      <Link
                        className="lessonLink"
                        to={`/lesson/${lesson.name}`}
                        state={{ fileUrl: lesson.file.url, email: email, courseId: id, lessonId: lesson._id }} // Pass the fileUrl via state
                      >
                        Watch Lesson
                      </Link>
                      <span
                        className={`statusIndicator ${lessonStatuses[lesson._id] ? 'completed' : 'incomplete'}`}
                      >
                        {lessonStatuses[lesson._id] ? 'Completed' : 'Incomplete'}
                      </span>
                      </>
                      ) : (
                        <span>
                          
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No lessons available for this course.</p>
              )
            }
          </div>
      )}
        {activeTab === 'Description' && <p className='full-description'>{course.description}</p>}
      </div>
    </div>  
    </div >
      );
}
export default Course