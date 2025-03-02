const Course = require("../models/courseSchema.js");
const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");

const createCourse = async (req, res) => {
    try {
        const { courseName, collName, duration, fees } = req.body;
        const existingCourse = await Course.findOne({ courseName });
        if (existingCourse) {
            return res.status(400).json({ message: "Course already exists" });
        }

        const course = new Course({
            courseName,
            collName,
            duration,
            fees
        });

        const result = await course.save();
        res.status(201).json({result: result, message: "Course created successfully"});
    }catch(err){
        console.log('error')
        res.status(500).json(err);
    }
}

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (err) {
        console.log('error')
        res.status(500).json(err);
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { courseName } = req.body;
        console.log(courseName);
        const existingCourse = await Course.findById(courseName);
        if (!existingCourse) {
            return res.status(400).json({ message: "Course does not exist" });
        }

        const sclasses = await Sclass.find({course: courseName});
        const students = await Student.find({course: courseName});
        const teachers = await Teacher.find({course: courseName});
        const subjects = await Subject.find({course: courseName});

        console.log(existingCourse, sclasses, students, teachers, subjects);
        
        if(sclasses){
            sclasses.forEach(async (sclass) => {
                await sclass.deleteOne();
            });
        }

        if(students){
            students.forEach(async (student) => {
                await student.deleteOne();
            });
        }

        if(teachers){
            teachers.forEach(async (teacher) => {
                await teacher.deleteOne();
            });
        }

        if(subjects){
            subjects.forEach(async (subject) => {
                await subject.deleteOne();
            });
        }

        const result = await existingCourse.deleteOne();
        res.status(201).json({result});
    }catch(err){
        console.log('error')
        res.status(500).json(err);
    }
}

module.exports = { createCourse, getCourses, deleteCourse};