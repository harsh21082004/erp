const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

// Teacher registration with subject handling
const teacherReg = async (req, res) => {
    const { name, email, password, collName, role, teachSubjects, course } = req.body;

    try {
        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Check if the teacher with the given email already exists
        let teacher = await Teacher.findOne({ email });

        if (teacher) {
            // Check if the course ID already exists for this teacher
            if (teacher.course.toString() !== course) {
                // If course is different, create a new teacher with the same password
                const newTeacher = new Teacher({
                    name,
                    email,
                    password: teacher.password, // Retain the existing hashed password
                    role,
                    collName,
                    course,
                    teachSubjects // Add teachSubjects directly
                });

                // Save the new teacher
                let result = await newTeacher.save();
                return res.status(201).send({ result, message: 'New teacher created for a different course' });
            }

            // Loop through each new class and subject in teachSubjects
            for (const newSubjectData of teachSubjects) {
                const { class: newClass, subjects: newSubjects } = newSubjectData;

                // Check if the class already exists in the teacher's teachSubjects
                const existingClass = teacher.teachSubjects.find(
                    sub => sub.class.classId.toString() === newClass.classId
                );

                if (existingClass) {
                    // Check if each subject in newSubjects already exists
                    for (const newSubject of newSubjects) {
                        const existingSubject = existingClass.subjects.find(
                            sub => sub.subjectId.toString() === newSubject.subjectId
                        );

                        if (existingSubject) {
                            return res.status(400).send({ message: 'Teacher already exists for this subject in the class' });
                        }

                        // If subjectId is new, push the new subject into the existing class
                        existingClass.subjects.push(newSubject);
                    }
                } else {
                    // If class does not exist, add the entire new class and subjects
                    teacher.teachSubjects.push(newSubjectData);
                }
            }

            // Save updated teacher
            await teacher.save();
            return res.status(200).send({ message: 'Teacher updated with new class and subjects' });
        }

        // If no teacher with this email exists, create a new teacher
        const newTeacher = new Teacher({
            name,
            email,
            password: hashedPass,
            role,
            collName,
            course,
            teachSubjects // Add teachSubjects directly
        });

        // Save the new teacher
        let result = await newTeacher.save();
        return res.status(201).send({ result, message: 'Teacher created successfully' });
    } catch (err) {
        return res.status(500).send({ message: 'Server error', error: err });
    }
};



const teacherLogIn = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ email: req.body.email });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            if (validated) {
                teacher = await teacher.populate("teachSubject", "subName sessions")
                teacher = await teacher.populate("school", "schoolName")
                teacher = await teacher.populate("teachSclass", "sclassName")
                teacher.password = undefined;
                res.send(teacher);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Teacher not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.find({ collName: req.params.id }).populate('course');
        if (teachers) {
            res.send(teachers);
        }
        else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachersByAdmin = async (req, res) => {
    try {
        let teachers = await Teacher.find({ collName: req.params.id }).populate('course');
        if (teachers) {
            res.send(teachers);
        }
        else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName")
        if (teacher) {
            teacher.password = undefined;
            res.send(teacher);
        }
        else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubject },
            { new: true }
        );

        await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });

        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        await Subject.updateOne(
            { teacher: deletedTeacher._id, teacher: { $exists: true } },
            { $unset: { teacher: 1 } }
        );

        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ school: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ sclassName: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports = {
    teacherReg,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance,
    getTeachersByAdmin
};