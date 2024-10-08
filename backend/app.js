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
const redirectUrl = process.env.REDIRECT_URL;
console.log(redirectUrl);

app.use(express.json());
const allowedOrigin = 'https://nex-gen-learn-deployment-frontend.vercel.app';
app.use(cors({
    origin: allowedOrigin, // Allow specific frontend URL
    credentials: true, // Allow cookies and headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

const access = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin !== allowedOrigin) {
        return res.status(403).sendFile(path.join(__dirname, 'template', 'Error403.html'));
    }
    next();
};

app.use(access);

app.get('/', async (req, res) => {
    res.send("Hello World");
});
app.use('/api/courses', CourseRoute);
app.use('/api/instructor', InstructorRoute);
app.use('/api/user', UserRoute);
app.use('/api/quiz', QuizRoute);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
