const express = require('express')
const router = express.Router();
const multer = require('multer');
const path = require('path')
const {createCourse , getCourseById,getLessonUrl,editCourseById,deleteCourseById,deleteLessonById,getCourseCategory} = require(path.join(__dirname,'..','controller','CourseController'));


const storage = multer.memoryStorage(); 
const upload = multer({ storage });

router.post('/', upload.array('files'), createCourse);
router.get('/department/:name',getCourseCategory);
router.get('/:id', getCourseById);
router.get('/lesson/:id',getLessonUrl);

router.put('/:id',editCourseById);
router.delete('/:id',deleteCourseById);
router.delete('/:cid/lesson/:lid',deleteLessonById);

module.exports = router;