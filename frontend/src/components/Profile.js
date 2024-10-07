import React, { useEffect, useState } from 'react';
import { useUser } from '../hooks/userContext'; // Adjust the path as necessary
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Styles/Profile.css'
import thumbnail from '../assests/thumbnail.png';
const Profile = () => {
    const [userdata, setUserData] = useState(null);
    const email = useUser().email;
    const [activeTab, setActiveTab] = useState('enrolled');
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [name, setName] = useState(null);
    useEffect(() => {
        const fetchDetails = async () => {
            if (email) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/user/profile/${email}`);
                    setUserData(response.data);
                } catch (error) {
                    setError('Error while fetching the profile.');
                    console.error("Error while fetching the profile", error);
                }
            }
        };
        fetchDetails();
    }, [email]);
    useEffect(() => {
        const fetchCourses = async () => {
          if (!email) return;
          try {
            setLoading(true);
    
            if (activeTab === 'enrolled') {
              const response = await axios.get(`http://localhost:5000/api/user/get/enroll/${email}`);
              if (Array.isArray(response.data)) {
                setCourses(response.data);
              } else {
                console.error('Unexpected data format:', response.data);
              }
            } else if (activeTab === 'certifications') {
              const response = await axios.get(`http://localhost:5000/api/user/get/certificates/${email}`);
              if (Array.isArray(response.data.certificates)) {
                setCertificates(response.data.certificates);
                setName(response.data.name);
              } else {
                console.error('Unexpected data format:', response.data);
              }
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
  return (
    <div className='profile-container-head'>
        
        <div className="profile-buttons">

        <div>
          <Link to='/enrolled/courses' >
          Enrolled courses
        </Link>
          </div>
          {/* <div>
          <Link to='/certified/courses' >
          My Certifications
        </Link>
          </div> */}
        </div>
        <h1>User Profile</h1>
        <div className="profile-container">

        {error && <p className="error">{error}</p>}
            {userdata ? (
                <div>
                    <h2>Name: {userdata.name}</h2>
                    <h2>Email:{userdata.email}</h2>
                    <h2>Phone: {userdata.phone}</h2>
                    <h2>Created At: {new Date(userdata.createdAt).toLocaleDateString()}</h2>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>

    </div>
  )
}

export default Profile