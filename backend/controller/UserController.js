const path = require('path');
const CourseModel = require(path.join(__dirname, '..', 'models', 'Course'));
const UserModel = require(path.join(__dirname, '..', 'models', 'User'));
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true // Allow cookies to be sent and received
}));
const createUser = async (req, res) => {
    
    const { name, email, phone,password } = req.body;
    try{
        const existingUser = await UserModel.findOne({ email });

        if(existingUser) {
            return res.send("User existed with this email Id");
        }

    const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            phone,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({message:"success"});
    } catch(error) {
        console.error('Error registering User:', error);
        res.status(500).send('Server error');
    }
};
const loginUser = async (req,res)=>{
    const email  = req.body.email || req.body.emailLogin;
    const password = req.body.password || req.body.passwordLogin;
    
    try{
        const user = await UserModel.findOne({email});
        if(!user){
            return res.send("No User found with this data");
        }
        const hashedPassword = await bcrypt.compare(password,user.password);
        if(!hashedPassword){
            return res.status(400).send("Invalid credentials");
        }
        const token = jwt.sign({email: email}, 
            "jwt-access-token-secret-key", {expiresIn: '1d'})
            res.cookie('usertoken', token, {
                maxAge: 60 * 60 * 1000, // 1 hr
                httpOnly: false, // Set to true if you want the cookie to be inaccessible to JavaScript
                secure: false, // Set to true if you're using HTTPS
                sameSite: 'None', // 'None' to allow cross-site cookies
                path: '/',
            });
            
          console.log(token)
          return res.status(200).json({ token });
    }catch(error){
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
};
const getenrollCourse = async (req, res) => {
    const { email } = req.params;
    try {
        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).send("No user found with this email address");
        }

        // Assuming user.enrolled_Courses is an array of objects with courseId and enrolledAt properties
const coursesData = user.enrolled_Courses.map(cid => ({
    courseId: cid.courseId,
    enrolledAt: cid.enrolledAt // Assuming enrolledAt is a property of each course object
}));


// Fetch course data using course IDs
const coursedata = await Promise.all(
    coursesData.map(async ({ courseId, enrolledAt }) => {
        const course = await CourseModel.findById(courseId);
        return {
            ...course.toObject(), // Convert Mongoose document to plain object
            enrolledDate: enrolledAt // Add enrolledAt to the course data
        };
    })
);
        
        return res.json(coursedata);
    } catch (error) {
        console.error("Error while fetching the data:", error);
        return res.status(500).send("Server error");
    }
};

const enrollCourse = async (req, res) => {
    const { email, id } = req.params;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const course = await CourseModel.findOne({ _id: id });
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }

        // Increment the enrolled count
        course.enrolledCount += 1;

        // Add the course to the user's enrolled courses
        user.enrolled_Courses.push({ courseId: id });

        // Save both user and course
        await user.save();
        await course.save();

        return res.json({ enrolled: true, message: 'Successfully enrolled in the course' });
    } catch (error) {
        console.error("Error enrolling in course:", error);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

const enrolledCourse = async (req, res) => {
    const { email, id } = req.params;

    try {
        const user = await UserModel.findOne({ email });
        console.log("UserName ************************",user.name);
        

        if (!user) {
            return res.status(404).send({ isEnrolled: false , message: 'User not found' });
        }

        // Check if the user is enrolled in the course
        const enrolled = user.enrolled_Courses.some(u => u.courseId === id);
        if(!enrolled){
            return res.json({ isEnrolled: false })
        }

        return res.json({ isEnrolled: true , name : user.name})
    } catch (error) {
        console.error(error);
        return res.status(500).send({isEnrolled: false , message: 'Server error' });
    }
};

const allenrolled = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await UserModel.findOne({ email });        

        if (!user) {
            return res.status(404).send({ isEnrolled: [] , message: 'User not found' });
        }

        // Check if the user is enrolled in the course
        const enrolled = user.enrolled_Courses.map(u => u.courseId);
        if(!enrolled){
            return res.json({isEnrolled: []})
        }

        return res.json({ isEnrolled: enrolled , name : user.name})
    } catch (error) {
        console.error(error);
        return res.status(500).send({isEnrolled: false , message: 'Server error' });
    }
};


const profile = async (req, res) => {
    try {
        const { email } = req.params; 

        if (!email) {
            return res.status(400).json({ message: "Invalid email" }); // Return 400 for bad request
        }

        const user = await UserModel.findOne({ email }); // Query the database with the email

        if (!user) {
            return res.status(404).json({ message: "User not found" }); // Return 404 if user not found
        }

        return res.status(200).json(user); // Return the user data if found
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" }); // Handle unexpected errors
    }
};
const getcookie = async (req,res)=>{
    const cookies = req.cookies; // Get all cookies
    console.log('Cookies:', cookies);
    res.send(cookies);
}

const lessonCompletion = async (req, res) => {
    const { email, cid, lid } = req.params; // Extract email, courseId (cid), and lessonId (lid)
    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Find the course by courseId in the enrolled_Courses array
        const course = user.enrolled_Courses.find(course => course.courseId === cid);

        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }
        
        // Find the lesson by lessonId in the lessons array
        const lesson = course.lessons.find(lesson => lesson.lessonId === lid);
        
        
        if (!lesson) {
            // If the lesson is not found, add it to the lessons array with status 'completed'
            course.lessons.push({
                lessonId: lid,
                status: 'completed'
            });
        } else {
            // If lesson is found, just update the status to 'completed'
            lesson.status = 'completed';
        }
        await user.save();

        return res.status(200).json({ message: 'Lesson completed successfully' });
    } catch (error) {
        console.error("Error completing lesson:", error);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

const lessonStatus = async (req, res) => {
    const { email, cid, lid } = req.params; // Extract email, courseId (cid), and lessonId (lid)
    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Find the course by courseId in the enrolled_Courses array
        const course = user.enrolled_Courses.find(course => course.courseId === cid);

        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }
        
        // Find the lesson by lessonId in the lessons array
        const lesson = course.lessons.find(lesson => lesson.lessonId === lid);
        
        if (!lesson) {
            // If the lesson is not found, add it to the lessons array with status 'completed'
            return res.send("No lesson found with this Id")
        }

        return res.status(200).json({status:lesson.status});
    } catch (error) {
        console.error("Error completing lesson:", error);
        return res.status(500).send({ message: 'Internal server error' });
    }
};
const checkCertificate = async (req,res)=>{
    const {email,id} = req.params;
    const user = await UserModel.findOne({email});
    if(!user){
        return res.send("No user found with this email");
    }
    const CompletedCourseList = user.completed_Courses;    
    if(CompletedCourseList){
        const isContain = CompletedCourseList.find(cid => cid.courseId === id && cid.completedAt);        
        if(isContain){
            return res.json({status:true , date:isContain.completedAt});
        }
    }
    return res.json({status:false});
}
const setCertificate = async(req,res)=>{
    const {email,id ,title,iname} = req.params;
    const user = await UserModel.findOne({email});    
    if(!user){
        return res.send("No user found with this email");
    }    
    if(id){
        user.completed_Courses.push({
            courseId:id,
            courseName:title,
            instructorName:iname
        });
    }
    await user.save();   
    return res.json({status:"success"});
}
const getCertificates = async (req, res) => {
    const { email } = req.params; // Destructure email from req.params
    
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.send('No user found with this email address');
        }

        // Assuming completed_Courses is an array of objects with courseId
        const certificates = user.completed_Courses.map(course => {
            return {
                courseId: course.courseId,
                courseName: course.courseName,
                instructorName:course.instructorName,
                completedAt: course.completedAt
            };
        });
        // Send the certificates back in the response
        return res.json({name : user.name,certificates});
    } catch (error) {
        console.log("Error while fetching the completed course details", error);
        return res.status(500).send("Internal Server Error");
    }
}

const checkQuiz = async(req,res)=>{
    const {email , id } = req.params;
    console.log("From Check Quizz" );
    
    try {
        const user = await UserModel.findOne({ email });
        console.log("Check Quiz *******************************************************************************");
        
        if (!user) {
            return res.send('No user found with this email address');
        }
        
        
        if( user.quiz.length){
            const data = user.quiz;
            const isContain = data.filter(cid  => cid.courseId ===id 

            )
            console.log("Iscontain",isContain);
            console.log(isContain[0].status);
            
            if(isContain[0].status){
                return res.json({status:true , present : true});
            }else{
                return res.json({status:false , present : true});
            }
            console.log("From Check Quizz" , isContain.status); 
        }
        
        return res.json({status:false , present : false});
//        return res.json({user})

    } catch (error) {
        console.log("Internal server error");
        
    }
}

module.exports = {
    createUser,
    loginUser,
    getcookie,
    profile,
    getenrollCourse,
    enrollCourse,
    enrolledCourse,
    allenrolled,
    lessonCompletion,
    lessonStatus,
    checkCertificate,
    setCertificate,
    getCertificates,
    checkQuiz
}