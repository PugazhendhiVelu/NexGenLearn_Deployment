const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const DBConnect = require(path.join(__dirname, 'config', 'DBConnection'));
const CourseRoute = require(path.join(__dirname,'routes','CourseRoute'));
const InstructorRoute = require(path.join(__dirname,'routes','InstructorRoute'));
const UserRoute = require(path.join(__dirname,'routes','UserRoute'));
const QuizRoute = require(path.join(__dirname,'routes','QuizRoute'));

const cookieParser = require('cookie-parser');
const app = express();
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
DBConnect();
app.use(cookieParser());

app.use(express.json());
const allowedOrigins = process.env.REDIRECT_URL;
app.use(cors({
    origin: allowedOrigins, // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true // Allow cookies to be sent and received
}));

/* const access = (req,res,next)=>{
    const origin = req.headers.origin;
    if (origin !== allowedOrigin) {
        return res.status(403).sendFile(path.join(__dirname, 'template', 'Error403.html'));
        // return res.status(403).send('Access denied. Invalid origin , You are not authorised to access this resource.');
    }
    next();
}  */
//app.use(access);
app.get('/', (req, res) => {
    res.send("Hello World");
});
app.use('/api/courses', CourseRoute);
app.use('/api/instructor',InstructorRoute);
app.use('/api/user',UserRoute);
app.use('/api/quiz',QuizRoute);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
