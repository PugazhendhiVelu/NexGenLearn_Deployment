const express = require('express')
const router = express.Router();
const path = require('path')


const {addQuiz , editQuiz , deleteQuiz , getQuiz , userQuiz,getUserQuiz} = require(path.join(__dirname,'..','controller','QuizController'));



router.post('/add/quiz/:id',addQuiz);
router.post('/add/record/:email/quiz/:id/:status',userQuiz);
router.get('/get/record/:email/quiz/:id',getUserQuiz);
router.get('/get/quiz/:id',getQuiz);
router.put('/edit/quiz/:id',editQuiz);
router.delete('/delete/quiz/:id',deleteQuiz);

module.exports = router;
