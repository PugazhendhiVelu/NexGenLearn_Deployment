const mongoose = require('mongoose');


const InstructorSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    phone : {
        type:String,
        required:true
    },
    bio : {
        type:String,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    createdAt : {
        type:Date,
        default:Date.now
    },
    specialization:[
        String
    ],
    Courses:[
        String
    ]
});
const Instructor = mongoose.model('instructors', InstructorSchema);

module.exports = Instructor;