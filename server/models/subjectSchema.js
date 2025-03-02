const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subjects: [{
        subName: {
            type: String,
            required: true,
        },
        subCode: {
            type: String,
            required: true,
        },
        session: {
            type: String,
            required: true,
        }
    }],
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sclass',
        required: true,
    },
    collName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true,
    }
}, { timestamps: true });

// Indexes to improve query performance
subjectSchema.index({ class: 1, course: 1, collName: 1 });

module.exports = mongoose.model("Subject", subjectSchema);
