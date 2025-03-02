const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
    },
    collName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    fees: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("course", courseSchema);