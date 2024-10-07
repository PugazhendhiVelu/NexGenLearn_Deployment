    
const mongoose = require('mongoose');
// required: true
const LessonSchema = new mongoose.Schema({
    name: { type: String, },
    file: {
        url: { type: String,  },
        public_id: { type: String,  }
    }
});
 
const CourseSchema = new mongoose.Schema({
    title: { type: String,  },
    thumbnail:{
            url: { type: String,  },
            public_id: { type: String, }
    },
    description: { type: String,  },
    department:{ type:String,},
    category:{ type:String , require:true}, // Price field
    lessons: [LessonSchema], // Lessons field with embedded schema
    instructorId: { type: String,}, // Instructor reference
    enrolledCount: { type: Number, default: 0 }, // Enrolled count
    createdAt: { type: Date, default: Date.now } ,
    price: { type: Number,  }// Created at timestamp
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
