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
const allowedOrigin = "https://nex-gen-learn-deployment-frontend.vercel.app";

// Use CORS middleware before any route handling or custom middleware
app.use(cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Handle preflight requests globally
app.options('*', cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Modify custom access middleware to bypass OPTIONS requests
// const access = (req, res, next) => {
//     // Bypass OPTIONS requests
//     if (req.method === 'OPTIONS') {
//         return next();
//     }

//     const origin = req.headers.origin;
//     if (origin !== allowedOrigin) {
//         return res.status(403).sendFile(path.join(__dirname, 'template', 'Error403.html'));
//         // Optionally, just send a simple message instead of serving a file
//         // return res.status(403).send('Access denied. Invalid origin.');
//     }
//     next();
// };

// // Make sure this runs AFTER CORS middleware
// app.use(access);

app.get('/', (req, res) => {
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
