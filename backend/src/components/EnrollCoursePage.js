// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useUser } from '../hooks/userContext';
// import thumbnail from '../assests/thumbnail.png';

// function EnrollCoursePage() {
//   const { email } = useUser(); // Ensure this returns an object with `email`
//   console.log("Enrolled  page ", email)
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // Added state for error
//   const [search, setSearch] = useState('');

//   // Fetch enrolled courses when component mounts
//   useEffect(() => {
//     const fetchEnrolledCourses = async () => {
//       if (!email) {
//         return; // Wait for email to be available
//       }

//       try {
//         const response = await axios.get(`http://localhost:5000/api/user/get/enroll/${email}`);
//         console.log(response.data);
//         if (Array.isArray(response.data)) {
//           setCourses(response.data);
//         } else {
//           console.error('Unexpected data format:', response.data);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error('Error while fetching enrolled courses:', error);
//         setError('Failed to load courses'); // Set error message
//         setLoading(false);
//       }
//     };

//     fetchEnrolledCourses();
//   }, [email]);


//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>; // Display error message

//   const filteredCourses = courses && courses.length > 0 ? courses.filter(course =>
//     course.title.toLowerCase().includes(search.toLowerCase())
//   ) : [];


//   return (
    



//     < div className = 'main-category' >
//       <h1>My Enrolled coures</h1>
//       <div className="main-categories-courses">
//         {courses.length > 0 ? (
//           courses.map(c => (
//             <div className="card-course" key={c.id}>
//               <div className="image-cover">
//                 <img src={thumbnail} alt={c.name} />
//               </div>
//               <h3>{c.title}</h3>
//               <p>Category: {c.category}</p>
//               <p>
//   Enrolled Date: {c.enrolledDate ? new Date(c.enrolledDate).toLocaleDateString() : 'N/A'}
// </p>
//               <div className="home-course-buttons">
//                 <Link to={`/Course/${c._id}`}>
//                   <button className="home-info-btn">More Info</button>
//                 </Link>
                 
//                 <Link to={`/Course/${c._id}`}>
//                   <button className="home-enroll-btn">Start Course </button>
//                 </Link>
                 
//               </div>
//             </div>
//           ))
//         ) : (
//           <p>No courses available in this category.</p>
//         )}
//       </div>
//     </div >
//   );
// }


// export default EnrollCoursePage;




import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../hooks/userContext';
import thumbnail from '../assests/thumbnail.png';

const CoursesPage = () => {
  const { email } = useUser(); // Ensure this returns an object with `email`
  const [activeTab, setActiveTab] = useState('enrolled');
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [name, setName] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!email) return;
      try {
        setLoading(true);
          const response = await axios.get(`http://localhost:5000/api/user/get/enroll/${email}`);
          if (Array.isArray(response.data)) {
            setCourses(response.data);
          } else {
            console.error('Unexpected data format:', response.data);
          }
          const responseCertificate = await axios.get(`http://localhost:5000/api/user/get/certificates/${email}`);
          if (Array.isArray(responseCertificate.data.certificates)) {
            console.log("Certificates data",responseCertificate.data.certificates);
            
            setCertificates(responseCertificate.data.certificates);
            setName(responseCertificate.data.name);
          } else {
            console.error('Unexpected data format:', responseCertificate.data);
          }

        setLoading(false);
      } catch (error) {
        console.error('Error while fetching data:', error);
        setError('Failed to load courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [email, activeTab]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCertificates = certificates.filter(certificate =>
    certificate?.courseName?.toLowerCase().includes(search.toLowerCase())
  );
  const hasCertificate = (courseId) => {
    return certificates.some(certificate => certificate.courseId === courseId);
};

const thumbnailImage = (courseid) => {
  const course = courses.find(c => c._id === courseid);
  console.log("course for thumbnail",course);
  
  
  if (!course) {
      console.error(`Course with ID ${courseid} not found.`);
      return null; // Return null if the course is not found
  }
  
  if (!course.thumbnail) {
      console.error(`Thumbnail not found for course ID ${courseid}.`);
      return null; // Return null if the thumbnail is not found
  }
  
  return course.thumbnail.url || null; // Return the thumbnail URL or null if not found
};


  return (
    <div className='main-category'>
      <h1>{activeTab === 'enrolled' ? 'My Enrolled Courses' : 'My Certifications'}</h1>

      {/* Tab Navigation */}
      <div className="tab-buttons">
        {activeTab ==='enrolled' ? (
          <>
          
          <button onClick={() => setActiveTab('certifications')} className='home-certificate-btn'>
          Certifications
        </button>
          </>
        ) :(
          <>
          
          <button onClick={() => setActiveTab('enrolled')} className='home-enroll-btn'>
          Enrolled Courses
          </button>
          </>
        )
      
        }
        
      </div>

      <div className="main-categories-courses">
        {activeTab === 'enrolled' ? (
          filteredCourses.length > 0 ? (
            filteredCourses.map(c => (
              <div className="card-course" key={c.id}>
                <div className="image-cover">
                <img src={c.thumbnail?.url || thumbnail} alt={c.name} />
                </div>
                <h3>{c.title}</h3>
                <p>Category: {c.category}</p>
                <p>
                  Enrolled Date: {c.enrolledDate ? new Date(c.enrolledDate).toLocaleDateString() : 'N/A'}
                </p>
                <div className="home-course-buttons">
                  <Link to={`/Course/${c._id}`}>
                    <button className="home-info-btn">More Info</button>
                  </Link>
                  {hasCertificate(c._id) ? (
                      <>
                    <button className="home-certificate-btn">Completed</button>
                      </>
                  ) : (
                    <>
                    <Link to={`/Course/${c._id}`}>
                    <button className="home-enroll-btn">Start Course</button>
                  </Link>
                    </>
                  )}
                  
                  
                </div>
              </div>
            ))
          ) : (
            <p>No enrolled courses available.</p>
          )
        ) : (
          filteredCertificates.length > 0 ? (
            filteredCertificates.map(c => (
              <div className="card-course" key={c.courseId}>
                <div className="image-cover">
                  
                  <img src={ thumbnailImage(c.courseId) ||thumbnail} alt={c.courseName} />
                </div>
                <h3>{c.courseName}</h3>
                <p>Instructor: {c.instructorName}</p>
                <p>
                  Completed Date: {c.completedAt ? new Date(c.completedAt).toLocaleDateString() : 'N/A'}
                </p>
                <div className="home-course-buttons">
                  <Link to={`/Course/${c.courseId}`}>
                    <button className="home-info-btn">More Info</button>
                  </Link>
                  <Link to={`/certificate?name=${encodeURIComponent(name)}&course=${encodeURIComponent(c.courseName)}&instructor=${encodeURIComponent(c.instructorName)}&date=${encodeURIComponent(new Date(c.completedAt).toLocaleDateString())}`}>
                    <button className="home-certificate-btn">Get Certificate</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No certifications available.</p>
          )
        )}
      </div>
    </div>
  );
}

export default CoursesPage;
