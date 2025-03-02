const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const Teacher = require('../models/teacherSchema.js');

const sclassCreate = async (req, res) => {
    try {
        const { semester, section, collName, courseId, branch, session } = req.body;

        // Validate input
        if (!semester || !section || !collName || !courseId || !branch || !session) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Find if there's an existing document with the same semester, collName, and courseId
        const existingClass = await Sclass.findOne({ semester, collName, course: courseId });

        if (existingClass) {
            // Check if the branch already exists in the classes array
            const branchExists = existingClass.classes.find(
                (cls) => cls.branch === branch
            );

            if (branchExists) {
                // Check if the section already exists in the branch's classes array
                const classExists = branchExists.class.some(
                    (cls) => cls.section === section && cls.session === session
                );

                if (classExists) {
                    return res.status(400).json({ message: 'Sorry, this class section already exists.' });
                }

                // If the section doesn't exist, push it into the branch's class array
                branchExists.class.push({ section, classSemester: semester, session });
                const result = await existingClass.save();
                return res.status(200).json({ result: result, message: 'Class created successfully.' });
            }

            // If the branch doesn't exist, push the new branch and class into the classes array
            existingClass.classes.push({
                branch: branch,
                class: [{ section, classSemester: semester, session }]
            });

            const result = await existingClass.save();
            return res.status(200).json({ result: result, message: 'Class created successfully.' });
        } else {
            // If no existing document, create a new one
            const newClass = new Sclass({
                semester,
                classes: [{
                    branch: branch,
                    class: [{ section, classSemester: semester, session }]
                }],
                collName,
                course: courseId
            });

            const result = await newClass.save();
            return res.status(201).json({ result: result, message: 'Class created successfully.' });
        }
    } catch (err) {
        console.error('Error creating Sclass:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};


const sclassList = async (req, res) => {
    try {
        const sclasses = await Sclass.find({ course: req.params.id }).populate('course');

        if (sclasses.length > 0) {
            res.send(sclasses);
        } else {
            res.status(404).send({ message: "No classes found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};

const sclassListByAdmin = async (req, res) => {
    try {
        const sclasses = await Sclass.find({ collName: req.params.id }).populate('course');

        if (sclasses.length > 0) {
            res.send(sclasses);
        } else {
            res.status(404).send({ message: "No classes found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};


const getSclassDetail = async (req, res) => {
    try {
        let sclass = await Sclass.findById(req.params.id)
            .populate('course', 'courseName')
            .populate('collName', 'adminName');  // Populate the collName field as well

        if (sclass) {
            res.send(sclass);
        } else {
            res.status(404).send({ message: "No class found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};


const getSclassStudents = async (req, res) => {
    try {
        let students = await Student.find({ sclassName: req.params.id });
        if (students.length > 0) {
            // Remove passwords from student details before sending them
            let modifiedStudents = students.map((student) => ({
                ...student._doc,
                password: undefined
            }));
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
};


const deleteSclass = async (req, res) => {
    try {
        const { classId } = req.body;

        // Validate input
        if (!classId) {
            return res.status(400).json({ message: 'classId is required.' });
        }

        // Find the document that contains the class with the given classId
        const sclass = await Sclass.findOne({ "classes.class._id": classId });

        if (!sclass) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Loop through the classes array and remove the class object with the matching classId
        sclass.classes.forEach((branch, branchIndex) => {
            const classIndex = branch.class.findIndex(cls => cls._id.toString() === classId);

            if (classIndex !== -1) {
                // Remove the specific class
                branch.class.splice(classIndex, 1);

                // If the branch has no more classes, remove the branch
                if (branch.class.length === 0) {
                    sclass.classes.splice(branchIndex, 1);
                }
            }
        });

        console.log('Updated class:', sclass);

        const updatedClass = await sclass.save();
        // If no classes remain in the document, delete the entire document
        if (sclass.classes.length === 0) {
            await Sclass.findByIdAndDelete(sclass._id);
        }
        await Student.deleteMany({ class: classId });
        await Teacher.updateMany(
            { "teachSubjects.class.classId": classId }, // Match the classId in the teacher's classes
            {
                $pull: {
                    teachSubjects: { 
                        "class.classId": classId // Remove the subjects where the classId matches
                    }
                }
            }
        );
        await Subject.deleteMany({ class: classId });

        return res.status(200).json({ message: "Class section and related data deleted successfully", result: updatedClass });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};




const deleteSclasses = async (req, res) => {
    try {
        const deletedClasses = await Sclass.deleteMany({ collName: req.params.id });
        if (deletedClasses.deletedCount === 0) {
            return res.status(404).send({ message: "No classes found to delete" });
        }

        // Also delete related students, subjects, and teachers
        await Student.deleteMany({ collName: req.params.id });
        await Subject.deleteMany({ collName: req.params.id });
        await Teacher.deleteMany({ collName: req.params.id });

        res.send({ message: "Classes and related data deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = { sclassCreate, sclassList, sclassListByAdmin, deleteSclass, deleteSclasses, getSclassDetail, getSclassStudents };
