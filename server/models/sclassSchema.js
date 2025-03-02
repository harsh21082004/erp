const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true
    },
    classSemester: {
        type: Number,
        required: true
    },
    session: {
        type: String,
        required: true
    },
});

const branchSchema = new mongoose.Schema({
    branch:{
        type: String,
        required: true
    },
    class: [classSchema]
});

const sclassSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true
    },
    classes: [branchSchema],
    collName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    }
}, { timestamps: true });

// Unique index on course, year, and collName
sclassSchema.index({ semester: 1, collName: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Sclass", sclassSchema);
