const path = require('path');
const UserModel = require('../models/User');
const CourseModel = require(path.join(__dirname, '..', 'models', 'Course'));
const QuizModel = require(path.join(__dirname, '..', 'models', 'Quiz'));



const addQuiz = (async(req,res)=>{
    const id =  req.params.id;
    console.log(id)
    const {questions , passingScore ,  score} = req.body;
    console.log({questions , passingScore  , score});
    
    try {
        const course = await CourseModel.findById(id);
        console.log(course);
        
    if(!course){
        return res.json({message:'No course found with this id'});
    }
    const quizdata = new QuizModel({
        courseId:id,
        questions,
        passingScore,
        score
    })
    console.log(quizdata);
    
    await quizdata.save();
    res.status(201).json({message:'Success'});
    } catch (error) {
        res.status(500).json({message:'failed'});
    }
    
})

const getQuiz = (async(req,res)=>{
    const {id} =  req.params;
    console.log("Get Quiz",id)
   
    try {
        const course = await CourseModel.findById(id);
        console.log(course);
        
    if(!course){
        return res.json({message:'No course found with this id'});
    }
    const coursedata = {
        title : course.title,
        /*   */
        category : course.category
    }
    const quizdata = await QuizModel.findOne({courseId:id});
    if(!quizdata){
        return res.json({message:'No quiz / assessment found with this id'});
    }
    res.status(201).json({coursedata,quizdata});
    } catch (error) {
        res.status(500).json({message:'failed'});
    }

})
const editQuiz=  (async(req,res)=>{
    const { id } = req.params;
  const { questions, passingScore, score } = req.body;
  console.log(id,"Edit Quiz");
  

  try {
    // Find the quiz by ID
    let quiz = await QuizModel.findOne({courseId:id});

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Update quiz fields
    quiz.questions = questions;
    quiz.passingScore = passingScore;
    quiz.score = score;

    // Save the updated quiz
    await quiz.save();

    res.status(200).json({ message: 'Quiz updated successfully', quiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Failed to update quiz' });
  }

})
const deleteQuiz =(()=>{
    
})

const userQuiz = async (req, res) => {
    const { email, id, status } = req.params; // Extract parameters from the request
    console.log(email, id, status);
    
    if (!email || !id) {
        return res.status(400).json({ message: "Email and course ID are required" });
    }

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No user found with this email" });
        }

        // Check if the quiz entry for this course already exists
        const existingQuiz = user.quiz.find(q => q.courseId === id);

        if (existingQuiz) {
            existingQuiz.status = status;
            existingQuiz.testDate = Date.now();
        } else {
            // If not, add a new quiz entry
            user.quiz.push({
                courseId: id,
                status: status === 'pass' ? true : false,
                testDate: Date.now()
            });
        }

        // Save the updated user record
        await user.save();

        res.status(200).json({ message: "Quiz status updated successfully", quiz: user.quiz });
    } catch (error) {
        console.error("Error while updating the quiz record in the user field:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getUserQuiz = async(req,res)=>{
    const { email, id} = req.params; // Extract parameters from the request
    console.log(email, id);
    
    if (!email || !id) {
        return res.status(400).json({ message: "Email and course ID are required" });
    }

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No user found with this email" });
        }

        // Check if the quiz entry for this course already exists
        const existingQuiz = user.quiz.find(q => q.courseId === id);

        if (!existingQuiz) {
            return res.json({attempt:false , status:false});
        }
        else{
            if(existingQuiz.status){
                return res.json({attempt:true , status:true});
            }
        }
        return res.json({attempt:true , status:false});
    }catch(error){
        console.log("Error while fetching the assessment data in the user's account");
        
    }
        
}

module.exports = {
    addQuiz,
    getQuiz,
    editQuiz,
    deleteQuiz,
    userQuiz,
    getUserQuiz
}