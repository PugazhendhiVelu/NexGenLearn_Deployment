const express = require('express')
const router = express.Router();
const path = require('path')
const {createInstructor ,loginInstructor,instructorProfile,instructorCourses, getInstructoreById,editInstructoreById} = require(path.join(__dirname,'..','controller','InstructorController'));
    


router.post('/register', createInstructor);
router.post('/login',loginInstructor );
router.get('/profile/:email',instructorProfile)
router.get('/courses',instructorCourses)
router.get('/:id', getInstructoreById);
router.put('/:id',editInstructoreById);

module.exports = router;