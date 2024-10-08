import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/AllNavbar';
import Footer from './components/Footer';
import Main from './components/Main';
import Departments from './components/Departments';
import Category from './components/Category';
import Course from './components/Course'
import About from './components/About';
import LessonPage from './components/LessonPage';
import CertificatePage from './components/CertificatePage';
import { UserProvider } from './hooks/userContext';
import EnrollCoursePage from './components/EnrollCoursePage';
import Profile from './components/Profile';
import Quiz from './components/Quiz';

function App() {
  const categoryNames = [
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
  return (
    <UserProvider>
    <Router>
      <Navbar categoryNames={categoryNames} />
      <div className="App">
        <Routes>
          <Route path="/" element={<Main categoryNames={categoryNames} />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Departments" element={<Departments />} />
          <Route path="/Departments/:category" element={<Category />} />
          <Route path="/quiz/user/:email/:id" element={<Quiz />} />
          <Route path='/Course/:id' element={<Course/>}/>
          <Route path="/lesson/:name" element={<LessonPage/>} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPage/>} />
          <Route path ="/certificate" element={<CertificatePage/>} />
          <Route path="/enrolled/courses/" element={<EnrollCoursePage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
    </UserProvider>
  );
}

export default App;
