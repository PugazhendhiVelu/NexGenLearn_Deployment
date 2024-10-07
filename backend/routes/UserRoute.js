const express = require('express')
const router = express.Router();
const path = require('path')

const {createUser,loginUser,checkQuiz,getcookie,profile,getenrollCourse,getCertificates,enrollCourse,enrolledCourse,allenrolled,lessonCompletion,lessonStatus,checkCertificate,setCertificate} = require(path.join(__dirname,'..','controller','UserController'));


router.post('/register', createUser);
router.post('/login',loginUser );
router.get('/get/cookie',getcookie);
router.get('/profile/:email',profile );

router.get('/get/enroll/:email',getenrollCourse);
router.post('/enroll/:email/:id', enrollCourse);
router.get('/enrolled/:email/:id', enrolledCourse);
router.get('/allenrolled/:email',allenrolled);

router.post('/:email/course/:cid/lesson/:lid',lessonCompletion);
router.get('/:email/course/:cid/lesson/:lid',lessonStatus);


router.get('/check/quiz/:email/:id',checkQuiz);
/* router.post('/add/quiz/data/:email/:id') */
router.post('/set/certificate/:email/:id/:title/:iname',setCertificate);
router.get('/get/certificates/:email',getCertificates);
router.get('/check/certificate/:email/:id',checkCertificate);

module.exports = router;