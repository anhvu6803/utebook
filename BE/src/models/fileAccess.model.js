const mongoose = require('mongoose');

const fileAccessSchema = new mongoose.Schema({
    fileId: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: String,
        required: true
    },
    allowedEmails: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index để tìm kiếm nhanh
fileAccessSchema.index({ fileId: 1 });
fileAccessSchema.index({ uploadedBy: 1 });
fileAccessSchema.index({ allowedEmails: 1 });

module.exports = mongoose.model('FileAccess', fileAccessSchema); 