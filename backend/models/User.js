const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    enrolled_Courses: [{
        courseId: {
            type: String,
            required: true,
            trim: true
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        lessons: [{
            lessonId: {
                type: String,
                required: true,
                trim: true
            },
            status: {
                type: String,
                default: "not completed",
                enum: ['not completed', 'in progress', 'completed'] // Enum to limit values
            }
        }]
    }],
    completed_Courses: [{
        courseId: {
            type: String,
        },
        courseName: {
            type: String
        },
        instructorName: {
            type: String
        },

        completedAt: {
            type: Date,
            default: Date.now
        },
    }],
    quiz: [{
        courseId: {
            type: String,
            required: true // It's often a good idea to require fields that are essential
        },
        status: {
            type: Boolean,
            default: false
        },
        testDate: {
            type: Date,
            default: Date.now // Ensure that the type is specified
        }
    }]
});
const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;