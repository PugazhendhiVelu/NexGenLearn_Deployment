const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [
    {
      optionText: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],
});

const quizSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  questions: [questionSchema],
  passingScore: { type: Number, required: true },
  score: { type: Number, required: true }, // Total number of questions
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
