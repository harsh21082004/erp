const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true
    },
    subjects: [
        {
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject',
            },
            marksObtained: {
                type: Number,
                default: 0
            },
            totalMarks: {
                type: Number,
                default: 0
            },
        }
    ]
});

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    rollNum: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    },
    collName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    role: {
        type: String,
        default: "Student"
    },
    examResult: [examSchema],
    attendance: [{
        date: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Present', 'Absent']
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject'
        }
    }],
    fees: {
        totalFees: {
            type: Number,
            required: true
        },
        paidFees: [
            {
                year: {
                    type: String,  // e.g., "First Year", "Second Year"
                    required: true
                },
                amountPaid: {
                    type: Number,
                    default: 0
                }
            }
        ]
    }
});

module.exports = mongoose.model("student", studentSchema);
