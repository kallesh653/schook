const mongoose = require('mongoose');

const smsTemplateSchema = new mongoose.Schema({
    // Template Information
    template_name: { type: String, required: true },
    template_code: { type: String, required: true, unique: true },
    template_type: {
        type: String,
        required: true,
        enum: ['attendance', 'fees', 'exam', 'general', 'emergency', 'event']
    },

    // Message Content
    message_template: { type: String, required: true },
    variables: [{
        variable_name: { type: String, required: true },
        description: { type: String, required: true },
        example: { type: String }
    }],

    // Settings
    is_active: { type: Boolean, default: true },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    // Metadata
    school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },
    created_by: { type: String, required: true },
    updated_by: { type: String },
    usage_count: { type: Number, default: 0 },

    // Timing Settings
    auto_send: { type: Boolean, default: false },
    send_time: { type: String }, // HH:MM format for scheduled sends

    // Sample Message (processed with example data)
    sample_message: { type: String }
}, {
    timestamps: true
});

// Index for better performance
smsTemplateSchema.index({ school: 1, template_type: 1 });
smsTemplateSchema.index({ template_code: 1 });

// Method to process template with actual data
smsTemplateSchema.methods.processTemplate = function(data) {
    let processedMessage = this.message_template;

    // Replace variables with actual data
    this.variables.forEach(variable => {
        const placeholder = `{{${variable.variable_name}}}`;
        const value = data[variable.variable_name] || variable.example || '';
        processedMessage = processedMessage.replace(new RegExp(placeholder, 'g'), value);
    });

    return processedMessage;
};

// Static method to get default templates
smsTemplateSchema.statics.getDefaultTemplates = function() {
    return [
        {
            template_name: "Student Absent Alert",
            template_code: "ABSENT_ALERT",
            template_type: "attendance",
            message_template: "Dear {{guardian_name}}, your child {{student_name}} from {{class}} is absent today ({{date}}). Please contact school if this is unexpected. - {{school_name}}",
            variables: [
                { variable_name: "guardian_name", description: "Parent/Guardian name", example: "Mr. Smith" },
                { variable_name: "student_name", description: "Student's full name", example: "John Smith" },
                { variable_name: "class", description: "Student's class", example: "Class 5A" },
                { variable_name: "date", description: "Current date", example: "2024-01-15" },
                { variable_name: "school_name", description: "School name", example: "ABC School" }
            ],
            sample_message: "Dear Mr. Smith, your child John Smith from Class 5A is absent today (2024-01-15). Please contact school if this is unexpected. - ABC School"
        },
        {
            template_name: "Fee Balance Alert",
            template_code: "FEE_BALANCE",
            template_type: "fees",
            message_template: "Dear {{guardian_name}}, fee payment reminder for {{student_name}} ({{class}}). Balance: ₹{{balance_amount}}. Due date: {{due_date}}. Pay at {{school_name}} office. Contact: {{contact_number}}",
            variables: [
                { variable_name: "guardian_name", description: "Parent/Guardian name", example: "Mrs. Johnson" },
                { variable_name: "student_name", description: "Student's full name", example: "Emily Johnson" },
                { variable_name: "class", description: "Student's class", example: "Class 8B" },
                { variable_name: "balance_amount", description: "Outstanding fee amount", example: "5000" },
                { variable_name: "due_date", description: "Fee due date", example: "2024-01-30" },
                { variable_name: "school_name", description: "School name", example: "XYZ School" },
                { variable_name: "contact_number", description: "School contact number", example: "9876543210" }
            ],
            sample_message: "Dear Mrs. Johnson, fee payment reminder for Emily Johnson (Class 8B). Balance: ₹5000. Due date: 2024-01-30. Pay at XYZ School office. Contact: 9876543210"
        },
        {
            template_name: "Exam Schedule Alert",
            template_code: "EXAM_SCHEDULE",
            template_type: "exam",
            message_template: "Dear {{guardian_name}}, {{exam_name}} for {{student_name}} ({{class}}) is scheduled on {{exam_date}} at {{exam_time}}. Subject: {{subject}}. Venue: {{venue}}. - {{school_name}}",
            variables: [
                { variable_name: "guardian_name", description: "Parent/Guardian name", example: "Mr. Wilson" },
                { variable_name: "exam_name", description: "Examination name", example: "Mid-term Exam" },
                { variable_name: "student_name", description: "Student's full name", example: "Sarah Wilson" },
                { variable_name: "class", description: "Student's class", example: "Class 10A" },
                { variable_name: "exam_date", description: "Exam date", example: "2024-02-15" },
                { variable_name: "exam_time", description: "Exam time", example: "10:00 AM" },
                { variable_name: "subject", description: "Exam subject", example: "Mathematics" },
                { variable_name: "venue", description: "Exam venue", example: "Room 101" },
                { variable_name: "school_name", description: "School name", example: "PQR School" }
            ],
            sample_message: "Dear Mr. Wilson, Mid-term Exam for Sarah Wilson (Class 10A) is scheduled on 2024-02-15 at 10:00 AM. Subject: Mathematics. Venue: Room 101. - PQR School"
        },
        {
            template_name: "General Announcement",
            template_code: "GENERAL_ANNOUNCEMENT",
            template_type: "general",
            message_template: "Dear Parents, {{announcement_text}} For more details, contact {{school_name}} at {{contact_number}}. Thank you.",
            variables: [
                { variable_name: "announcement_text", description: "Main announcement message", example: "School will remain closed tomorrow due to weather conditions." },
                { variable_name: "school_name", description: "School name", example: "ABC School" },
                { variable_name: "contact_number", description: "School contact number", example: "9876543210" }
            ],
            sample_message: "Dear Parents, School will remain closed tomorrow due to weather conditions. For more details, contact ABC School at 9876543210. Thank you."
        }
    ];
};

module.exports = mongoose.model('SmsTemplate', smsTemplateSchema);