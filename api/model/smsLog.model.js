const mongoose = require('mongoose');

const smsLogSchema = new mongoose.Schema({
    // Message Information
    template_id: { type: mongoose.Schema.ObjectId, ref: 'SmsTemplate' },
    template_code: { type: String },
    message_content: { type: String, required: true },

    // Recipient Information
    recipient_phone: { type: String, required: true },
    recipient_name: { type: String },
    recipient_type: {
        type: String,
        enum: ['student', 'parent', 'teacher', 'staff'],
        default: 'parent'
    },

    // Student/Class Information (for context)
    student_id: { type: mongoose.Schema.ObjectId, ref: 'Student' },
    student_name: { type: String },
    class_id: { type: mongoose.Schema.ObjectId, ref: 'Class' },
    class_name: { type: String },

    // Sending Information
    sent_by: { type: String, required: true },
    sent_by_name: { type: String },
    school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },

    // SMS Status
    status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'failed', 'cancelled'],
        default: 'pending'
    },

    // SMS Gateway Response
    gateway_response: {
        message_id: { type: String },
        gateway_status: { type: String },
        gateway_message: { type: String },
        delivery_status: { type: String },
        cost: { type: Number, default: 0 }
    },

    // Timing
    scheduled_time: { type: Date },
    sent_time: { type: Date },
    delivered_time: { type: Date },

    // Categorization
    category: {
        type: String,
        enum: ['attendance', 'fees', 'exam', 'general', 'emergency', 'event'],
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    // Metadata
    error_message: { type: String },
    retry_count: { type: Number, default: 0 },
    max_retries: { type: Number, default: 3 }
}, {
    timestamps: true
});

// Indexes for better query performance
smsLogSchema.index({ school: 1, createdAt: -1 });
smsLogSchema.index({ recipient_phone: 1, createdAt: -1 });
smsLogSchema.index({ status: 1, createdAt: -1 });
smsLogSchema.index({ category: 1, createdAt: -1 });
smsLogSchema.index({ student_id: 1, createdAt: -1 });

// Method to mark SMS as sent
smsLogSchema.methods.markAsSent = function(gatewayResponse) {
    this.status = 'sent';
    this.sent_time = new Date();
    if (gatewayResponse) {
        this.gateway_response = { ...this.gateway_response, ...gatewayResponse };
    }
    return this.save();
};

// Method to mark SMS as delivered
smsLogSchema.methods.markAsDelivered = function() {
    this.status = 'delivered';
    this.delivered_time = new Date();
    return this.save();
};

// Method to mark SMS as failed
smsLogSchema.methods.markAsFailed = function(errorMessage) {
    this.status = 'failed';
    this.error_message = errorMessage;
    this.retry_count += 1;
    return this.save();
};

// Static method to get SMS statistics
smsLogSchema.statics.getStatistics = function(schoolId, fromDate, toDate) {
    const matchQuery = { school: schoolId };

    if (fromDate || toDate) {
        matchQuery.createdAt = {};
        if (fromDate) matchQuery.createdAt.$gte = new Date(fromDate);
        if (toDate) matchQuery.createdAt.$lte = new Date(toDate);
    }

    return this.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: null,
                totalSent: { $sum: 1 },
                successful: { $sum: { $cond: [{ $in: ['$status', ['sent', 'delivered']] }, 1, 0] } },
                failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                totalCost: { $sum: '$gateway_response.cost' },
                byCategory: {
                    $push: {
                        category: '$category',
                        status: '$status'
                    }
                }
            }
        }
    ]);
};

module.exports = mongoose.model('SmsLog', smsLogSchema);