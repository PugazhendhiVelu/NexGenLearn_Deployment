const path = require('path');
const CourseModel = require(path.join(__dirname, '..', 'models', 'Course'));
const InstructorModel = require(path.join(__dirname, '..', 'models', 'Instructor'));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const createInstructor = async (req, res) => {

    const { name, email, phone, bio, specialization, password } = req.body;
    try{
        const existingInstructor = await InstructorModel.findOne({ email });

        if(existingInstructor) {
            return res.send("Instructor existed with this email Id");
        }

    const hashedPassword = await bcrypt.hash(password, 10);

        const newInstructor = new InstructorModel({
            name,
            email,
            phone,
            bio,
            specialization,
            password: hashedPassword
        });
        console.log(newInstructor)
        const token = email;
        console.log(token);
        
        await newInstructor.save();
        res.status(201).json(token);
    } catch(error) {
        console.error('Error registering instructor:', error);
        res.status(500).send('Server error');
    }
};
const loginInstructor = async (req,res)=>{
    const {email, password}  = req.body;
    
    try{
        const instructor = await InstructorModel.findOne({email});
        if(!instructor){
            return res.send("No Instructor found with this data");
        }
        const hashedPassword = await bcrypt.compare(password,instructor.password);
        if(!hashedPassword){
            return res.status(400).send("Invalid credentials");
        }
        const token = jwt.sign({email: email}, 
            "jwt-access-token-instructor-secret-key", {expiresIn: '1d'})
        console.log("Instructor token ",token)
            return res.status(200).json({ token });
    }catch(error){
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
};

const instructorCourses = async(req,res)=>{
    const email = req.query.email;
    console.log(email)
    try{
        const instructor = await InstructorModel.findOne({email});
        
        
        const courses  = await CourseModel.find({instructorId:instructor._id});
        
        return res.send(courses);
    }catch(error){
        console.error('Courses error:', error);
        res.status(500).send('Server error');

    }
}

const instructorProfile = async (req, res) => {
    const email = req.params.email;

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ message: "No instructor found with this email" });
    }

    try {
        // Find the instructor by email
        const instructor = await InstructorModel.findOne({ email });

        // Check if instructor exists
        if (!instructor) {
            return res.status(404).json({ message: "No data found with this email address" });
        }

        return res.status(200).json(instructor); // Return the instructor data
    } catch (error) {
        console.error("Error fetching instructor profile:", error);
        return res.status(500).json({ message: "An error occurred while fetching the instructor profile" });
    }
};



const getInstructoreById = async(re,res)=>{

};

const editInstructoreById = async(req,res)=>{

};
module.exports = {
    createInstructor,
    loginInstructor,
    instructorProfile,
    instructorCourses,
    getInstructoreById,
    editInstructoreById
};
