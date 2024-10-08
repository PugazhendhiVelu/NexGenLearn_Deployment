import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../Styles/Quiz.css';  // Import the external CSS
import { useUser } from '../hooks/userContext';

const Quiz = ({ courseId }) => {
  const id = useParams();
  const { email } = useUser(); 
  const [quiz, setQuiz] = useState(null);  // To hold the quiz data
  const [course, setCourse] = useState(null);  // To hold the course data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [answers, setAnswers] = useState({}); // To hold the user's answers
  const [result, setResult] = useState(null); // To display the result after submission
  const [totalMarks, setTotalMarks] = useState(0); // To display the total marks
  const [earnedMarks, setEarnedMarks] = useState(0); // To display the earned marks
  const [passed, setPassed] = useState(false); // To track pass or fail status
  const [attempted, setAttempted] = useState(false); // To track pass or fail status
  const [completed , setCompleted] = useState(false);
  // Fetch the quiz when the component is mounted
  console.log("Quiz id ",id.id);
  
  useEffect(() => {
    const fetchAssessment = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/quiz/get/record/${email}/quiz/${id.id}`);
            console.log(response.data, "From fetchAssessment");

            if(response.data.attempt){
              setAttempted(true)
              setPassed(response.data.status);
              if(response.data.status){
                setCompleted(true);
              }
            }
            
        } catch (error) {
            console.error("Internal server error while fetching assessment data of the user", error);
        }
    };

    if (email && id.id) { // Check if email and id.id are defined
        fetchAssessment();
    }
}, [email, id.id]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quiz/get/quiz/${id.id}`);
        console.log("Fetch quiz ",response.data)
        setQuiz(response.data.quizdata);  // Set the fetched quiz data
        setCourse(response.data.coursedata);  // Set the course data
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();  // Call the function to fetch quiz
  }, [courseId]);

  // Handle the answer selection for each question
  const handleAnswerChange = (questionIndex, optionIndex) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex }); // Store the selected answer
  };

  // Submit the quiz and calculate the score
  const handleSubmit = async() => {
  
    let correctAnswers = quiz.questions.filter((q, index) => {
      return q.options[answers[index]]?.isCorrect; // Compare user's answer to the correct one
    });

    const earned = correctAnswers.length * quiz.score;
    const total = quiz.questions.length * quiz.score;

    // Calculate score
    setTotalMarks(total); // Total possible marks
    const score = earned ; 
    setEarnedMarks(score); // Earned marks
    console.log(
      earned , total , totalMarks , score , ((score/total)*100) ,quiz.passingScore
    );
    
    const passedQuiz = ((score/total)*100) >= quiz.passingScore;
    setPassed(passedQuiz);  // Determine if user passed or failed    
    setResult(passedQuiz ? 'Passed' : 'Failed');  // Set pass/fail based on the score
    try {
      const response = await axios.post(`http://localhost:5000/api/quiz/add/record/${email}/quiz/${id.id}/${passedQuiz}`);
      console.log(response.data);
    } catch (error) {
      console.log("Internal server error in the handle submit of quiz");
      
    }

  };

  // Navigate to the next question
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to the previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Render loading state if quiz data hasn't loaded yet
  if (!quiz) return <div>Loading quiz...</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Course Title : {course?.title}</h1>
      <h3 style={{ textAlign: 'center', color: 'black' }}>Category of the course : {course?.category}</h3>

      {!result && !completed  && (
        <>
        <div className="quiz-card">
        <p className="quiz-question">{currentQuestion.questionText}</p>
        <div className="quiz-options-container">
          {currentQuestion.options.map((option, optionIndex) => (
            <label key={optionIndex} className="quiz-option">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                onChange={() => handleAnswerChange(currentQuestionIndex, optionIndex)}
                checked={answers[currentQuestionIndex] === optionIndex}
              />
              {option.optionText}
            </label>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        {currentQuestionIndex > 0 && (
          <button className="quiz-button quiz-button-prev" onClick={handlePrevious}>
            Previous
          </button>
        )}

        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button className="quiz-button quiz-button-next" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button className="quiz-button quiz-button-submit" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
        </>
      ) 
      }

      {/* Display the result after submission */}

      {completed && (
  <>
    <div className="completed-quiz-certificate">
      <h1>You have successfully passed the assessment</h1>
      <p>
    Click the button below to navigate and get your certificate.
    <br />Thank you!
</p>

      <Link  to={`/Course/${id.id}`}>
        <button className="completed-certificate-button">Go back</button>
        </Link>
    </div>
  </>
)}
{!completed && result && (
  <>
    <div className="quiz-result-section">
      <h2 style={{ color: result === 'passed' ? 'green' : 'red' }}>
        Quiz Result: {result}
      </h2>
      <p>Total Marks: {totalMarks}</p>
      <p>Earned Marks: {earnedMarks}</p>
      {passed ? (
        <Link  to={`/Course/${id.id}`}>
        <button className="completed-certificate-button">Go back</button>
        </Link>
      ) : (
        <button
          style={{
            backgroundColor: 'red',
            width: '150px',
            padding: '15px',
            margin: 'auto',
          }}
          className="quiz-button quiz-button-retake"
          onClick={() => window.location.reload()}
        >
          Retake Test
        </button>
      )}
    </div>
  </>
)}

      
    </div>
  );
};

export default Quiz;
