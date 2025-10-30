const SmsTemplate = require('../model/smsTemplate.model');
const SmsLog = require('../model/smsLog.model');
const Student = require('../model/student.model');
const StudentRecord = require('../model/studentRecord.model');
const Attendance = require('../model/attendance.model');
const axios = require('axios');

// SMS Gateway Configuration (using a demo service - replace with actual gateway)
const SMS_CONFIG = {
    API_KEY: process.env.SMS_API_KEY || 'demo_api_key',
    SENDER_ID: process.env.SMS_SENDER_ID || 'SCHOOL',
    GATEWAY_URL: process.env.SMS_GATEWAY_URL || 'https://api.textlocal.in/send/',
    USERNAME: process.env.SMS_USERNAME || 'demo_user',
    HASH: process.env.SMS_HASH || 'demo_hash'
};

// Create SMS Template
const createTemplate = async (req, res) => {
    try {
        const templateData = {
            ...req.body,
            school: req.user.schoolId || req.user.id,
            created_by: req.user.id
        };

        const template = new SmsTemplate(templateData);

        // Generate sample message if variables are provided
        if (template.variables && template.variables.length > 0) {
            const sampleData = {};
            template.variables.forEach(variable => {
                sampleData[variable.variable_name] = variable.example || `{{${variable.variable_name}}}`;
            });
            template.sample_message = template.processTemplate(sampleData);
        }

        await template.save();

        res.status(201).json({
            success: true,
            message: 'SMS template created successfully',
            data: template
        });
    } catch (error) {
        console.error('Error creating SMS template:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating SMS template',
            error: error.message
        });
    }
};

// Get all templates for school
const getTemplates = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;
        const { template_type, is_active } = req.query;

        const filter = { school: schoolId };
        if (template_type) filter.template_type = template_type;
        if (is_active !== undefined) filter.is_active = is_active === 'true';

        const templates = await SmsTemplate.find(filter)
            .sort({ createdAt: -1 })
            .populate('school', 'school_name');

        res.json({
            success: true,
            data: templates
        });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching templates',
            error: error.message
        });
    }
};

// Get single template by ID
const getTemplateById = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;
        const { id } = req.params;

        const template = await SmsTemplate.findOne({ _id: id, school: schoolId })
            .populate('school', 'school_name');

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        res.json({
            success: true,
            data: template
        });
    } catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching template',
            error: error.message
        });
    }
};

// Update SMS template
const updateTemplate = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;
        const { id } = req.params;

        const template = await SmsTemplate.findOne({ _id: id, school: schoolId });

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (key !== '_id' && key !== 'school' && key !== 'created_by') {
                template[key] = req.body[key];
            }
        });

        template.updated_by = req.user.id;

        // Regenerate sample message if variables changed
        if (template.variables && template.variables.length > 0) {
            const sampleData = {};
            template.variables.forEach(variable => {
                sampleData[variable.variable_name] = variable.example || `{{${variable.variable_name}}}`;
            });
            template.sample_message = template.processTemplate(sampleData);
        }

        await template.save();

        res.json({
            success: true,
            message: 'Template updated successfully',
            data: template
        });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating template',
            error: error.message
        });
    }
};

// Delete SMS template
const deleteTemplate = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;
        const { id } = req.params;

        const template = await SmsTemplate.findOneAndDelete({ _id: id, school: schoolId });

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        res.json({
            success: true,
            message: 'Template deleted successfully',
            data: template
        });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting template',
            error: error.message
        });
    }
};

// Initialize default templates for a school
const initializeDefaultTemplates = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;
        const defaultTemplates = SmsTemplate.getDefaultTemplates();

        const templatesWithSchool = defaultTemplates.map(template => ({
            ...template,
            school: schoolId,
            created_by: req.user.id
        }));

        // Check if templates already exist
        const existingTemplates = await SmsTemplate.find({ school: schoolId });

        if (existingTemplates.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Default templates already exist for this school'
            });
        }

        const savedTemplates = await SmsTemplate.insertMany(templatesWithSchool);

        res.status(201).json({
            success: true,
            message: 'Default templates initialized successfully',
            data: savedTemplates
        });
    } catch (error) {
        console.error('Error initializing templates:', error);
        res.status(500).json({
            success: false,
            message: 'Error initializing default templates',
            error: error.message
        });
    }
};

// Send SMS using template
const sendSmsFromTemplate = async (req, res) => {
    try {
        const { template_id, recipients, data } = req.body;
        const schoolId = req.user.schoolId || req.user.id;

        // Get template
        const template = await SmsTemplate.findOne({ _id: template_id, school: schoolId });
        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        const sentMessages = [];
        const failedMessages = [];

        for (const recipient of recipients) {
            try {
                // Process template with recipient data
                const recipientData = { ...data, ...recipient.data };
                const message = template.processTemplate(recipientData);

                // Create SMS log entry
                const smsLog = new SmsLog({
                    template_id: template._id,
                    template_code: template.template_code,
                    message_content: message,
                    recipient_phone: recipient.phone,
                    recipient_name: recipient.name,
                    recipient_type: recipient.type || 'parent',
                    student_id: recipient.student_id,
                    student_name: recipient.student_name,
                    class_id: recipient.class_id,
                    class_name: recipient.class_name,
                    sent_by: req.user.id,
                    sent_by_name: req.user.name || 'Admin',
                    school: schoolId,
                    category: template.template_type,
                    priority: template.priority
                });

                // Send SMS
                const smsResult = await sendSmsMessage(recipient.phone, message);

                if (smsResult.success) {
                    await smsLog.markAsSent(smsResult.gatewayResponse);
                    sentMessages.push({
                        phone: recipient.phone,
                        name: recipient.name,
                        message: message,
                        status: 'sent'
                    });
                } else {
                    await smsLog.markAsFailed(smsResult.error);
                    failedMessages.push({
                        phone: recipient.phone,
                        name: recipient.name,
                        error: smsResult.error
                    });
                }

                // Update template usage count
                template.usage_count += 1;

            } catch (error) {
                console.error(`Error sending SMS to ${recipient.phone}:`, error);
                failedMessages.push({
                    phone: recipient.phone,
                    name: recipient.name,
                    error: error.message
                });
            }
        }

        await template.save();

        res.json({
            success: true,
            message: `SMS sent successfully to ${sentMessages.length} recipients`,
            data: {
                sent: sentMessages,
                failed: failedMessages,
                total: recipients.length,
                success_count: sentMessages.length,
                failure_count: failedMessages.length
            }
        });

    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending SMS',
            error: error.message
        });
    }
};

// Send SMS to absent students
const sendAbsentStudentsSms = async (req, res) => {
    try {
        const { date, class_id, template_id } = req.body;
        const schoolId = req.user.schoolId || req.user.id;

        // Get absent students for the date
        const attendanceDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(attendanceDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(attendanceDate.setHours(23, 59, 59, 999));

        // Build attendance query
        const attendanceQuery = {
            school: schoolId,
            date: { $gte: startOfDay, $lte: endOfDay }
        };

        if (class_id) {
            attendanceQuery.class = class_id;
        }

        // Get attendance records
        const attendanceRecords = await Attendance.find(attendanceQuery)
            .populate('student', 'name guardian guardian_phone student_class')
            .populate('class', 'class_text');

        // Filter absent students
        const absentStudents = attendanceRecords.filter(record =>
            record.status === 'absent' &&
            record.student &&
            record.student.guardian_phone
        );

        if (absentStudents.length === 0) {
            return res.json({
                success: true,
                message: 'No absent students found for the specified criteria',
                data: { sent: [], failed: [], total: 0 }
            });
        }

        // Get template
        const template = await SmsTemplate.findOne({
            _id: template_id,
            school: schoolId
        }) || await SmsTemplate.findOne({
            template_code: 'ABSENT_ALERT',
            school: schoolId
        });

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'SMS template not found'
            });
        }

        // Prepare recipients
        const recipients = absentStudents.map(record => ({
            phone: record.student.guardian_phone,
            name: record.student.guardian,
            type: 'parent',
            student_id: record.student._id,
            student_name: record.student.name,
            class_id: record.class._id,
            class_name: record.class.class_text,
            data: {
                guardian_name: record.student.guardian,
                student_name: record.student.name,
                class: record.class.class_text,
                date: attendanceDate.toLocaleDateString(),
                school_name: req.user.school_name || 'Our School'
            }
        }));

        // Send SMS using the template
        const smsRequest = {
            body: {
                template_id: template._id,
                recipients: recipients,
                data: {
                    date: attendanceDate.toLocaleDateString(),
                    school_name: req.user.school_name || 'Our School'
                }
            }
        };

        // Simulate the SMS sending request
        req.body = smsRequest.body;
        return sendSmsFromTemplate(req, res);

    } catch (error) {
        console.error('Error sending absent students SMS:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending SMS to absent students',
            error: error.message
        });
    }
};

// Send SMS to students with fee balance
const sendFeeBalanceSms = async (req, res) => {
    try {
        const { minimum_balance, class_id, template_id } = req.body;
        const schoolId = req.user.schoolId || req.user.id;

        // Build query for students with fee balance
        const query = { school: schoolId };
        if (class_id) query.student_class = class_id;

        // Get students with fee information
        const students = await Student.find(query)
            .populate('student_class', 'class_text')
            .lean();

        // Filter students with balance fees
        const studentsWithBalance = students.filter(student => {
            if (!student.fees || !student.guardian_phone) return false;

            const balance = (student.fees.total_fees || 0) - (student.fees.paid_fees || 0);
            return balance >= (minimum_balance || 0);
        });

        if (studentsWithBalance.length === 0) {
            return res.json({
                success: true,
                message: 'No students found with the specified fee balance criteria',
                data: { sent: [], failed: [], total: 0 }
            });
        }

        // Get template
        const template = await SmsTemplate.findOne({
            _id: template_id,
            school: schoolId
        }) || await SmsTemplate.findOne({
            template_code: 'FEE_BALANCE',
            school: schoolId
        });

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'SMS template not found'
            });
        }

        // Prepare recipients
        const recipients = studentsWithBalance.map(student => {
            const balanceAmount = (student.fees.total_fees || 0) - (student.fees.paid_fees || 0);

            return {
                phone: student.guardian_phone,
                name: student.guardian,
                type: 'parent',
                student_id: student._id,
                student_name: student.name,
                class_id: student.student_class._id,
                class_name: student.student_class.class_text,
                data: {
                    guardian_name: student.guardian,
                    student_name: student.name,
                    class: student.student_class.class_text,
                    balance_amount: balanceAmount.toLocaleString(),
                    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    school_name: req.user.school_name || 'Our School',
                    contact_number: req.user.contact_number || '9876543210'
                }
            };
        });

        // Send SMS using the template
        const smsRequest = {
            body: {
                template_id: template._id,
                recipients: recipients,
                data: {
                    school_name: req.user.school_name || 'Our School',
                    contact_number: req.user.contact_number || '9876543210'
                }
            }
        };

        req.body = smsRequest.body;
        return sendSmsFromTemplate(req, res);

    } catch (error) {
        console.error('Error sending fee balance SMS:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending fee balance SMS',
            error: error.message
        });
    }
};

// Get SMS logs
const getSmsLogs = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;
        const {
            page = 1,
            limit = 20,
            status,
            category,
            student_id,
            from_date,
            to_date
        } = req.query;

        const filter = { school: schoolId };

        if (status) filter.status = status;
        if (category) filter.category = category;
        if (student_id) filter.student_id = student_id;

        if (from_date || to_date) {
            filter.createdAt = {};
            if (from_date) filter.createdAt.$gte = new Date(from_date);
            if (to_date) filter.createdAt.$lte = new Date(to_date);
        }

        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            SmsLog.find(filter)
                .populate('template_id', 'template_name template_code')
                .populate('student_id', 'name')
                .populate('class_id', 'class_text')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            SmsLog.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: logs,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total,
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error fetching SMS logs:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching SMS logs',
            error: error.message
        });
    }
};

// Get SMS statistics
const getSmsStatistics = async (req, res) => {
    try {
        const schoolId = req.user.schoolId || req.user.id;
        const { from_date, to_date } = req.query;

        const stats = await SmsLog.getStatistics(schoolId, from_date, to_date);

        res.json({
            success: true,
            data: stats[0] || {
                totalSent: 0,
                successful: 0,
                failed: 0,
                pending: 0,
                totalCost: 0
            }
        });

    } catch (error) {
        console.error('Error fetching SMS statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching SMS statistics',
            error: error.message
        });
    }
};

// Get list of absent students for approval
const getAbsentStudentsList = async (req, res) => {
    try {
        const { date, class_id } = req.query;
        const schoolId = req.user.schoolId || req.user.id;

        // Get absent students for the date
        const attendanceDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(attendanceDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(attendanceDate.setHours(23, 59, 59, 999));

        // Build attendance query
        const attendanceQuery = {
            school: schoolId,
            date: { $gte: startOfDay, $lte: endOfDay }
        };

        if (class_id) {
            attendanceQuery.class = class_id;
        }

        // Get attendance records
        const attendanceRecords = await Attendance.find(attendanceQuery)
            .populate('student', 'name guardian guardian_phone email student_image age')
            .populate('class', 'class_text')
            .lean();

        // Filter absent students with contact information
        const absentStudents = attendanceRecords
            .filter(record =>
                record.status === 'absent' &&
                record.student &&
                record.student.guardian_phone
            )
            .map(record => ({
                _id: record.student._id,
                student_name: record.student.name,
                guardian_name: record.student.guardian,
                guardian_phone: record.student.guardian_phone,
                email: record.student.email,
                class: record.class.class_text,
                class_id: record.class._id,
                age: record.student.age,
                student_image: record.student.student_image,
                attendance_id: record._id,
                date: attendanceDate.toLocaleDateString(),
                preview_message: `Dear ${record.student.guardian}, your child ${record.student.name} from ${record.class.class_text} is absent today (${attendanceDate.toLocaleDateString()}). Please contact school if this is unexpected. - ${req.user.school_name || 'Our School'}`
            }));

        res.json({
            success: true,
            data: {
                students: absentStudents,
                total_count: absentStudents.length,
                date: attendanceDate.toLocaleDateString(),
                can_send_sms: absentStudents.length > 0
            }
        });

    } catch (error) {
        console.error('Error fetching absent students list:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching absent students list',
            error: error.message
        });
    }
};

// Get list of students with fee balance for approval
const getFeeBalanceStudentsList = async (req, res) => {
    try {
        const { minimum_balance = 0, class_id } = req.query;
        const schoolId = req.user.schoolId || req.user.id;

        // Build query for students with fee balance
        const query = { school: schoolId };
        if (class_id) query.student_class = class_id;

        // Get students with fee information
        const students = await Student.find(query)
            .populate('student_class', 'class_text')
            .lean();

        // Filter students with balance fees and contact information
        const studentsWithBalance = students
            .filter(student => {
                if (!student.fees || !student.guardian_phone) return false;
                const balance = (student.fees.total_fees || 0) - (student.fees.paid_fees || 0);
                return balance >= minimum_balance;
            })
            .map(student => {
                const totalFees = student.fees.total_fees || 0;
                const paidFees = student.fees.paid_fees || 0;
                const balanceAmount = totalFees - paidFees;
                const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

                return {
                    _id: student._id,
                    student_name: student.name,
                    guardian_name: student.guardian,
                    guardian_phone: student.guardian_phone,
                    email: student.email,
                    class: student.student_class.class_text,
                    class_id: student.student_class._id,
                    age: student.age,
                    student_image: student.student_image,
                    total_fees: totalFees,
                    paid_fees: paidFees,
                    balance_amount: balanceAmount,
                    balance_formatted: `₹${balanceAmount.toLocaleString()}`,
                    due_date: dueDate,
                    preview_message: `Dear ${student.guardian}, fee payment reminder for ${student.name} (${student.student_class.class_text}). Balance: ₹${balanceAmount.toLocaleString()}. Due date: ${dueDate}. Pay at ${req.user.school_name || 'Our School'} office. Contact: ${req.user.contact_number || '9876543210'}`
                };
            });

        res.json({
            success: true,
            data: {
                students: studentsWithBalance,
                total_count: studentsWithBalance.length,
                minimum_balance: minimum_balance,
                can_send_sms: studentsWithBalance.length > 0
            }
        });

    } catch (error) {
        console.error('Error fetching fee balance students list:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching fee balance students list',
            error: error.message
        });
    }
};

// Helper function to send SMS through gateway
const sendSmsMessage = async (phone, message, gateway = 'textlocal') => {
    try {
        console.log(`📱 Sending SMS to ${phone} via ${gateway}: ${message}`);

        // Clean phone number (remove +91, spaces, etc.)
        const cleanPhone = phone.replace(/\D/g, '').replace(/^91/, '');

        switch (gateway) {
            case 'textlocal':
                return await sendViaTextLocal(cleanPhone, message);
            case 'combirds':
                return await sendViaComBirds(cleanPhone, message);
            case 'treesms':
                return await sendViaTreeSMS(cleanPhone, message);
            default:
                return await sendViaDemoGateway(cleanPhone, message);
        }

    } catch (error) {
        console.error('SMS Gateway Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// TextLocal SMS Gateway Integration
const sendViaTextLocal = async (phone, message) => {
    try {
        const params = new URLSearchParams();
        params.append('apikey', SMS_CONFIG.API_KEY);
        params.append('numbers', phone);
        params.append('message', message);
        params.append('sender', SMS_CONFIG.SENDER_ID);

        const response = await axios.post('https://api.textlocal.in/send/', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 10000
        });

        console.log('TextLocal Response:', response.data);

        if (response.data.status === 'success') {
            return {
                success: true,
                gatewayResponse: {
                    message_id: response.data.messages[0].id,
                    gateway_status: 'sent',
                    gateway_message: 'Message sent successfully via TextLocal',
                    cost: response.data.cost || 0.50,
                    balance: response.data.balance
                }
            };
        } else {
            return {
                success: false,
                error: response.data.errors ? response.data.errors[0].message : 'Unknown TextLocal error'
            };
        }
    } catch (error) {
        console.error('TextLocal Error:', error);
        return {
            success: false,
            error: `TextLocal API Error: ${error.message}`
        };
    }
};

// ComBirds SMS Gateway Integration
const sendViaComBirds = async (phone, message) => {
    try {
        const params = {
            UserName: SMS_CONFIG.USERNAME,
            password: SMS_CONFIG.API_KEY,
            MobileNo: phone,
            SenderID: SMS_CONFIG.SENDER_ID,
            CDMAHeader: SMS_CONFIG.SENDER_ID,
            Message: message,
            isFlash: 0,
            isUnicode: 0
        };

        const response = await axios.get('https://www.combirds.com/api/smsapi.php', {
            params: params,
            timeout: 10000
        });

        console.log('ComBirds Response:', response.data);

        // ComBirds returns XML, parse the response
        if (response.data.includes('Sent') || response.data.includes('Success')) {
            return {
                success: true,
                gatewayResponse: {
                    message_id: `combirds_${Date.now()}`,
                    gateway_status: 'sent',
                    gateway_message: 'Message sent successfully via ComBirds',
                    cost: 0.45,
                    raw_response: response.data
                }
            };
        } else {
            return {
                success: false,
                error: `ComBirds Error: ${response.data}`
            };
        }
    } catch (error) {
        console.error('ComBirds Error:', error);
        return {
            success: false,
            error: `ComBirds API Error: ${error.message}`
        };
    }
};

// TreeSMS Gateway Integration
const sendViaTreeSMS = async (phone, message) => {
    try {
        const params = {
            apikey: SMS_CONFIG.API_KEY,
            senderid: SMS_CONFIG.SENDER_ID,
            number: phone,
            message: message,
            format: 'json'
        };

        const response = await axios.post('https://sms.treesms.com/api/send', params, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        console.log('TreeSMS Response:', response.data);

        if (response.data.status === 'Success' || response.data.ErrorCode === '000') {
            return {
                success: true,
                gatewayResponse: {
                    message_id: response.data.JobId || `treesms_${Date.now()}`,
                    gateway_status: 'sent',
                    gateway_message: 'Message sent successfully via TreeSMS',
                    cost: 0.40,
                    job_id: response.data.JobId
                }
            };
        } else {
            return {
                success: false,
                error: `TreeSMS Error: ${response.data.ErrorMessage || 'Unknown error'}`
            };
        }
    } catch (error) {
        console.error('TreeSMS Error:', error);
        return {
            success: false,
            error: `TreeSMS API Error: ${error.message}`
        };
    }
};

// Demo Gateway (for testing without real SMS)
const sendViaDemoGateway = async (phone, message) => {
    try {
        console.log(`📱 DEMO SMS to ${phone}: ${message}`);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate success/failure (90% success rate for demo)
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            return {
                success: true,
                gatewayResponse: {
                    message_id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    gateway_status: 'sent',
                    gateway_message: 'Message sent successfully via Demo Gateway',
                    cost: 0.50
                }
            };
        } else {
            return {
                success: false,
                error: 'Demo Gateway: Simulated failure for testing'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: `Demo Gateway Error: ${error.message}`
        };
    }
};

// Update SMS gateway settings
const updateGatewaySettings = async (req, res) => {
    try {
        const { gateway, apiKey, senderId, username, isActive } = req.body;

        // Update SMS configuration (in production, store in database)
        SMS_CONFIG.GATEWAY_TYPE = gateway;
        SMS_CONFIG.API_KEY = apiKey;
        SMS_CONFIG.SENDER_ID = senderId;
        if (username) SMS_CONFIG.USERNAME = username;

        // In production, save to database:
        // await SmsSettings.findOneAndUpdate(
        //     { school: req.user.schoolId },
        //     { gateway, apiKey, senderId, username, isActive },
        //     { upsert: true }
        // );

        res.json({
            success: true,
            message: 'SMS gateway settings updated successfully',
            data: {
                gateway,
                senderId,
                isActive
            }
        });
    } catch (error) {
        console.error('Error updating gateway settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating gateway settings',
            error: error.message
        });
    }
};

// Test SMS gateway connection
const testGatewayConnection = async (req, res) => {
    try {
        const { gateway, apiKey, senderId, testNumber } = req.body;

        // Temporarily update config for testing
        const originalConfig = { ...SMS_CONFIG };
        SMS_CONFIG.API_KEY = apiKey;
        SMS_CONFIG.SENDER_ID = senderId;

        const testMessage = `Test SMS from ${senderId}. Gateway is working properly. Time: ${new Date().toLocaleString()}`;

        const result = await sendSmsMessage(testNumber, testMessage, gateway);

        // Restore original config
        Object.assign(SMS_CONFIG, originalConfig);

        if (result.success) {
            res.json({
                success: true,
                message: 'Test SMS sent successfully',
                data: result.gatewayResponse
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Test SMS failed',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error testing gateway:', error);
        res.status(500).json({
            success: false,
            message: 'Error testing gateway connection',
            error: error.message
        });
    }
};

module.exports = {
    createTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
    initializeDefaultTemplates,
    sendSmsFromTemplate,
    sendAbsentStudentsSms,
    sendFeeBalanceSms,
    getSmsLogs,
    getSmsStatistics,
    getAbsentStudentsList,
    getFeeBalanceStudentsList,
    updateGatewaySettings,
    testGatewayConnection
};