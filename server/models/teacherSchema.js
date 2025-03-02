const mongoose = require('mongoose');

// Subject Schema for each subject taught by a teacher
const subjectSchema = new mongoose.Schema({
    subName: { type: String, required: true }, // Subject name
    subCode: { type: String, required: true }, // Subject code
    session: { type: String, required: true }, // Number of sessions for the subject
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' } // Reference to the subject
});

// Branch and Class Schema for teacher's assigned class
const classSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sclass', required: true }, // Reference to the Sclass schema
    branch: { type: String, required: true }, // Branch name
    section: { type: String, required: true }, // Section of the class
    semester: { type: Number, required: true }, // Semester number
});

// Main Teacher Schema
const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Teacher's name
    email: { type: String, required: true }, // Unique email for the teacher
    password: { type: String, required: true }, // Password for the teacher's account
    role: { type: String, default: 'Teacher' }, // Role, default set to Teacher
    collName: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true }, // Reference to the admin (college)
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true }, // Reference to the course
    teachSubjects: [{
        subjects: [subjectSchema], // Array of subjects taught by the teacher
        class: classSchema // Class and branch information for where the subjects are taught
    }],
    attendance: [{
        date: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Present', 'Absent']
        },
    }]
}, { timestamps: true });

// Indexes to improve query performance

teacherSchema.index({ collName: 1, course: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Teacher', teacherSchema);
