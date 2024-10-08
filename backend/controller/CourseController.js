
const path = require('path');
const Course = require(path.join(__dirname,'..','models','Course'));
const InstructorModel = require(path.join(__dirname, '..', 'models', 'Instructor'));
const cloudinary = require(path.join(__dirname,'..','config','cloudinaryConfig'))

const createCourse = async(req,res)=>{

    try {
        const { title, description,email, price, lessons ,category, enrolledCount ,thumbnail, department } = req.body;
        console.log('Request body:', req.body);
        console.log("Lessons:",lessons);
        

        if(!email){
            return res.send("Invalid Instructor");
        }
        if (!lessons || lessons.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        const lessonswithUrl = lessons.map(file => ({
            name: file.name,
            file: {
                url: file.url,
                public_id: file.public_id 
            }
        }));

        console.log("after map ",lessonswithUrl);
        const id = await InstructorModel.findOne({email});
        console.log("Thumbnail details ", thumbnail)
        console.log("Department ",department);
        
        const newCourse = new Course({
            title,
            description,
            department,
            thumbnail :{
                url:thumbnail.url,
                public_id:thumbnail.public_id,
            },
            price,
            category,
            instructorId:id._id,
            lessons:lessonswithUrl,
            enrolledCount
        });
        console.log("new course",newCourse);
        
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send('Server error');
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        console.log("getCourseById",course);
        
        if (!course) return res.status(404).send('Course not found');
        const Instructor = await InstructorModel.findById(course.instructorId);
        const InstructorName  = Instructor.name
        res.json({course:course , InstructorName:InstructorName});
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).send('Server error');
    }
};

const editCourseById =async(req,res)=>{
    try{
        const courseId = req.params.id;
        const newData = req.body;
        const filter={};
        filter._id = courseId;
        const course = await Course.findOne(filter);
        if(!course){
            return res.status(404).json({ error: 'Course not found' }) 
        }
        const updateCourse = await Course.findOneAndUpdate(
            filter,
            newData,
            {new:true,runValidators:true}
        );
        res.status(201).json(updateCourse);
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const deleteCourseById = async(req,res)=>{
    const courseId = {_id: req.params.id};
    try{
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).send("Course not found");
        }
        await Course.findByIdAndDelete(courseId);
        return res.send(true);
    }catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

const deleteLessonById = async (req, res) => {
    const courseId = { _id: req.params.cid }; 
    const lessonId = req.params.lid;

    try {
        const course = await Course.findOne(courseId);
        if (!course) {
            return res.status(404).send("Course not found"); 
        }
        const newData = course.lessons.filter(lesson => lesson._id.toHexString() !== lessonId);
        const updatedCourse = await Course.findOneAndUpdate(
            courseId,
            { lessons: newData },  
            { new: true, runValidators: true } 
        );
        res.status(200).json(updatedCourse); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

const getCourseCategory = async (req, res) => {
    const category_name = req.params.name;
    console.log(category_name);
    
    try {
        const courses = await Course.find({department:category_name});//
      
      // If no courses found
      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: "No courses found" });
      }
  
      // Successfully return the list of courses
      console.log(courses)
      return res.status(200).json(courses);
    } catch (error) {
      // Log the error and send an error response
      console.error('Error while fetching courses:', error);
      return res.status(500).json({ message: "Server error while fetching courses" });
    }
  };
  
  const getLessonUrl = async (req, res) => {
    const { cid, lid } = req.query;

    try {
        const course = await Course.findOne({ _id: cid });
        if (!course) {
            return res.status(404).send({ message: "Course not found" });
        }

        const lessons = course.lessons.filter(lesson => lesson._id.toString() === lid);
        if (lessons.length === 0) {
            return res.status(404).send({ message: "Lesson not found" });
        }

        return res.send(lessons[0]); // Send the first matching lesson
    } catch (error) {
        console.error("Error fetching lesson:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};


module.exports = {
    createCourse,
    getCourseById,
    editCourseById,
    deleteCourseById,
    deleteLessonById,
    getCourseCategory,
    getLessonUrl
};