const StudentRecord = require('../model/studentRecord.model');
const School = require('../model/school.model');
const Class = require('../model/class.model');

module.exports = {
    // Create new student record
    createStudentRecord: async (req, res) => {
        try {
            console.log('=== CREATE STUDENT RECORD ===');
            console.log('User:', req.user);
            console.log('Request body:', JSON.stringify(req.body, null, 2));
            
            // Don't require schoolId for now - just save the data
            const studentData = { ...req.body };

            // Ensure required field exists
            if (!studentData.student_name) {
                return res.status(400).json({
                    success: false,
                    message: 'Student name is required'
                });
            }

            // Handle empty enum fields by removing them or setting to undefined
            if (studentData.gender === '') {
                delete studentData.gender;
            }
            if (studentData.blood_group === '') {
                delete studentData.blood_group;
            }

            // Generate unique admission number if empty
            if (!studentData.admission_number || studentData.admission_number === '') {
                studentData.admission_number = 'ADM-' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
            }

            // Calculate balance fees if fees are provided
            if (studentData.fees) {
                Object.keys(studentData.fees).forEach(key => {
                    studentData.fees[key] = parseFloat(studentData.fees[key]) || 0;
                });
                studentData.fees.balance_fees = studentData.fees.total_fees - studentData.fees.paid_fees;
            }

            console.log('Creating student record with data:', JSON.stringify(studentData, null, 2));
            
            const newStudentRecord = new StudentRecord(studentData);
            const savedRecord = await newStudentRecord.save();
            
            console.log('✅ Student record saved successfully:', savedRecord._id);
            
            res.status(201).json({
                success: true,
                message: 'Student record created successfully',
                data: savedRecord
            });
        } catch (error) {
            console.error('❌ Error in createStudentRecord:', error);
            
            // Handle duplicate key error specifically
            if (error.code === 11000) {
                const duplicateField = error.message.includes('roll_number') ? 'roll number' : 'student data';
                return res.status(400).json({ 
                    success: false, 
                    message: `A student with this ${duplicateField} already exists in this class. Please use a different ${duplicateField}.`,
                    error: 'DUPLICATE_KEY_ERROR'
                });
            }
            
            res.status(500).json({ 
                success: false, 
                message: 'Error creating student record', 
                error: error.message
            });
        }
    },

    // Get all student records for school
    getAllStudentRecords: async (req, res) => {
        try {
            console.log('Getting student records for user:', req.user);
            const schoolId = req.user?.schoolId;

            const { page = 1, limit = 10, class: classFilter, class_id: classIdFilter, status } = req.query;

            let query = {};

            // Filter by school if schoolId is available AND class_id is not specified
            // When filtering by class_id, we prioritize that over school filtering
            if (schoolId && !classIdFilter) {
                query.school = schoolId;
            }

            // Filter by class string or class_id if provided
            if (classIdFilter) {
                console.log('Filtering by class_id:', classIdFilter);

                // First check if ANY students have class_id populated
                const studentsWithClassId = await StudentRecord.countDocuments({ class_id: { $exists: true, $ne: null } });
                console.log(`Students with class_id populated: ${studentsWithClassId}`);

                if (studentsWithClassId > 0) {
                    // If some students have class_id, filter by it
                    query.class_id = classIdFilter;
                } else {
                    // If NO students have class_id populated, show all students
                    // This handles legacy data where class_id hasn't been set yet
                    console.log('No students have class_id populated - showing all students');
                    // Don't add any class filter - return all students
                }
            } else if (classFilter) {
                console.log('Filtering by class string:', classFilter);
                query.class = classFilter;
            }

            if (status) query.status = status;

            console.log('Query for student records:', JSON.stringify(query));

            const records = await StudentRecord.find(query)
                .populate('class_id', 'class_num class_text') // Populate class reference
                .populate('school', 'school_name')
                .sort({ created_at: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);

            console.log('Found records:', records.length);
            const total = await StudentRecord.countDocuments(query);

            res.status(200).json({
                success: true,
                data: records,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            });
        } catch (error) {
            console.error('Error in getAllStudentRecords:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching student records',
                error: error.message
            });
        }
    },

    // Get single student record
    getStudentRecord: async (req, res) => {
        try {
            const { id } = req.params;
            const schoolId = req.user.schoolId;
            
            const record = await StudentRecord.findOne({ _id: id, school: schoolId })
                .populate('class', 'class_text')
                .populate('school', 'school_name school_id established_year school_image');
                
            if (!record) {
                return res.status(404).json({ success: false, message: 'Student record not found' });
            }
            
            res.status(200).json({ success: true, data: record });
        } catch (error) {
            console.log('Error in getStudentRecord:', error);
            res.status(500).json({ success: false, message: 'Error fetching student record' });
        }
    },

    // Update student record
    updateStudentRecord: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('Updating student record:', id);
            console.log('Update data:', req.body);

            // Clean the data similar to create
            const cleanedData = { ...req.body };

            // Handle empty enum fields by removing them or setting to undefined
            if (cleanedData.gender === '') {
                delete cleanedData.gender;
            }
            if (cleanedData.blood_group === '') {
                delete cleanedData.blood_group;
            }

            // Generate unique admission number if empty (for updates too)
            if (!cleanedData.admission_number || cleanedData.admission_number === '') {
                cleanedData.admission_number = 'ADM-' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
            }

            // Convert established year
            if (cleanedData.established_year) {
                cleanedData.established_year = parseInt(cleanedData.established_year);
            }

            // Clean fees and calculate balance
            if (cleanedData.fees) {
                Object.keys(cleanedData.fees).forEach(key => {
                    cleanedData.fees[key] = parseFloat(cleanedData.fees[key]) || 0;
                });

                // Calculate balance fees
                cleanedData.fees.balance_fees = cleanedData.fees.total_fees - cleanedData.fees.paid_fees;
            }

            const updatedRecord = await StudentRecord.findOneAndUpdate(
                { _id: id },
                cleanedData,
                { new: true, runValidators: true }
            );

            if (!updatedRecord) {
                return res.status(404).json({ success: false, message: 'Student record not found' });
            }

            console.log('✅ Student record updated successfully');
            res.status(200).json({
                success: true,
                message: 'Student record updated successfully',
                data: updatedRecord
            });
        } catch (error) {
            console.error('❌ Error in updateStudentRecord:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating student record',
                error: error.message
            });
        }
    },

    // Delete student record
    deleteStudentRecord: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('Deleting student record:', id);

            const deletedRecord = await StudentRecord.findOneAndDelete({ _id: id });

            if (!deletedRecord) {
                return res.status(404).json({ success: false, message: 'Student record not found' });
            }

            console.log('✅ Student record deleted successfully');
            res.status(200).json({
                success: true,
                message: 'Student record deleted successfully'
            });
        } catch (error) {
            console.error('❌ Error in deleteStudentRecord:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting student record',
                error: error.message
            });
        }
    },

    // Generate PDF for student record
    generateStudentPDF: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('Generating PDF for student record:', id);

            const record = await StudentRecord.findOne({ _id: id });

            if (!record) {
                return res.status(404).json({ success: false, message: 'Student record not found' });
            }

            // Generate HTML content for PDF
            const htmlContent = generateStudentRecordHTML(record);

            console.log('✅ PDF generated successfully for:', record.student_name);
            res.status(200).json({
                success: true,
                message: 'PDF data generated successfully',
                data: {
                    htmlContent,
                    studentName: record.student_name,
                    rollNumber: record.roll_number
                }
            });
        } catch (error) {
            console.error('❌ Error in generateStudentPDF:', error);
            res.status(500).json({
                success: false,
                message: 'Error generating PDF',
                error: error.message
            });
        }
    },

    // Get statistics for student records
    getStudentRecordStats: async (req, res) => {
        try {
            console.log('Getting stats for user:', req.user);
            const schoolId = req.user?.schoolId;

            // For testing - calculate stats for all records if no school ID
            console.log('Calculating stats for all records...');

            const totalStudents = await StudentRecord.countDocuments({});
            const activeStudents = await StudentRecord.countDocuments({ status: 'Active' });

            // Calculate total fees, collected fees, and balance fees
            const totalFeesAgg = await StudentRecord.aggregate([
                { $group: { _id: null, total: { $sum: '$fees.total_fees' } } }
            ]);
            const totalFeesCollectedAgg = await StudentRecord.aggregate([
                { $group: { _id: null, total: { $sum: '$fees.paid_fees' } } }
            ]);
            const totalFeesBalanceAgg = await StudentRecord.aggregate([
                { $group: { _id: null, total: { $sum: '$fees.balance_fees' } } }
            ]);

            // Calculate today's fees collected from payment history
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

            const todayFeesAgg = await StudentRecord.aggregate([
                { $unwind: { path: '$fees.fee_payment_history', preserveNullAndEmptyArrays: true } },
                {
                    $match: {
                        'fees.fee_payment_history.payment_date': {
                            $gte: startOfDay,
                            $lt: endOfDay
                        }
                    }
                },
                { $group: { _id: null, total: { $sum: '$fees.fee_payment_history.amount' } } }
            ]);

            const stats = {
                totalStudents,
                activeStudents,
                inactiveStudents: totalStudents - activeStudents,
                totalFees: totalFeesAgg[0]?.total || 0,
                totalFeesCollected: totalFeesCollectedAgg[0]?.total || 0,
                totalFeesBalance: totalFeesBalanceAgg[0]?.total || 0,
                todayFeesCollected: todayFeesAgg[0]?.total || 0
            };

            console.log('✅ Student record stats calculated:', stats);
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            console.log('Error in getStudentRecordStats:', error);
            res.status(500).json({ success: false, message: 'Error fetching statistics' });
        }
    },

    // Add fee payment for a student
    addFeePayment: async (req, res) => {
        try {
            console.log('=== ADD FEE PAYMENT ===');
            const { id } = req.params;
            const { amount, payment_method, receipt_number, remarks } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid payment amount is required'
                });
            }

            const student = await StudentRecord.findById(id);
            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student record not found'
                });
            }

            // Create new payment record
            const newPayment = {
                amount: parseFloat(amount),
                payment_date: new Date(),
                payment_method: payment_method || 'Cash',
                receipt_number: receipt_number || `RCP-${Date.now()}`,
                remarks: remarks || ''
            };

            // Add to payment history
            student.fees.fee_payment_history.push(newPayment);

            // Update paid fees and recalculate balance
            student.fees.paid_fees = (student.fees.paid_fees || 0) + parseFloat(amount);
            student.fees.balance_fees = student.fees.total_fees - student.fees.paid_fees - (student.fees.advance_fees || 0);

            await student.save();

            console.log('✅ Fee payment added successfully');
            res.status(200).json({
                success: true,
                message: 'Fee payment added successfully',
                data: student
            });

        } catch (error) {
            console.error('❌ Error in addFeePayment:', error);
            res.status(500).json({
                success: false,
                message: 'Error adding fee payment',
                error: error.message
            });
        }
    }
};

// Helper function to generate HTML content for PDF
function generateStudentRecordHTML(record) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Student Record - ${record.student_name}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .school-info { display: flex; align-items: center; justify-content: center; gap: 20px; }
            .logo { width: 80px; height: 80px; border-radius: 50%; }
            .school-details h1 { margin: 0; color: #333; }
            .school-details p { margin: 5px 0; color: #666; }
            .section { margin: 20px 0; }
            .section h2 { background: #f0f0f0; padding: 10px; margin: 0 0 15px 0; border-left: 4px solid #007bff; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { padding: 8px; border-bottom: 1px solid #eee; }
            .info-item strong { color: #333; }
            .fees-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .fees-table th, .fees-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .fees-table th { background-color: #f2f2f2; }
            .total-row { background-color: #e8f4f8; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="school-info">
                <div class="school-details">
                    <h1>${record.school_name || 'School Name'}</h1>
                    <p>School ID: ${record.school_id || 'N/A'}</p>
                    <p>Established: ${record.established_year || 'N/A'}</p>
                    <p>Academic Year: ${record.academic_year || new Date().getFullYear()}</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Student Information</h2>
            <div class="info-grid">
                <div class="info-item"><strong>Name:</strong> ${record.student_name}</div>
                <div class="info-item"><strong>Roll Number:</strong> ${record.roll_number || 'N/A'}</div>
                <div class="info-item"><strong>Class:</strong> ${record.class || 'N/A'}</div>
                <div class="info-item"><strong>Section:</strong> ${record.section || 'N/A'}</div>
                <div class="info-item"><strong>Date of Birth:</strong> ${record.date_of_birth ? new Date(record.date_of_birth).toLocaleDateString() : 'N/A'}</div>
                <div class="info-item"><strong>Gender:</strong> ${record.gender || 'N/A'}</div>
                <div class="info-item"><strong>Father's Name:</strong> ${record.father_name || 'N/A'}</div>
                <div class="info-item"><strong>Mother's Name:</strong> ${record.mother_name || 'N/A'}</div>
                <div class="info-item"><strong>Blood Group:</strong> ${record.blood_group || 'N/A'}</div>
                <div class="info-item"><strong>Religion:</strong> ${record.religion || 'N/A'}</div>
                <div class="info-item"><strong>Admission Date:</strong> ${record.admission_date ? new Date(record.admission_date).toLocaleDateString() : 'N/A'}</div>
                <div class="info-item"><strong>Status:</strong> ${record.status}</div>
            </div>
        </div>

        <div class="section">
            <h2>Contact Information</h2>
            <div class="info-grid">
                <div class="info-item"><strong>Phone:</strong> ${record.phone_number || 'N/A'}</div>
                <div class="info-item"><strong>Email:</strong> ${record.email || 'N/A'}</div>
                <div class="info-item"><strong>Address:</strong> ${record.address ? `${record.address.street || ''}, ${record.address.city || ''}, ${record.address.state || ''} - ${record.address.pincode || ''}` : 'N/A'}</div>
                <div class="info-item"><strong>Emergency Contact:</strong> ${record.emergency_contact ? `${record.emergency_contact.name} (${record.emergency_contact.relationship}) - ${record.emergency_contact.phone}` : 'N/A'}</div>
            </div>
        </div>

        <div class="section">
            <h2>Fees Information</h2>
            <table class="fees-table">
                <tr>
                    <th>Fee Type</th>
                    <th>Amount (₹)</th>
                </tr>
                <tr class="total-row">
                    <td><strong>Total Fees</strong></td>
                    <td><strong>₹${(record.fees?.total_fees || 0).toLocaleString()}</strong></td>
                </tr>
                <tr>
                    <td>Paid Fees</td>
                    <td>₹${(record.fees?.paid_fees || 0).toLocaleString()}</td>
                </tr>
                <tr class="total-row" style="background-color: #ffebee;">
                    <td><strong>Balance Fees</strong></td>
                    <td><strong>₹${(record.fees?.balance_fees || 0).toLocaleString()}</strong></td>
                </tr>
            </table>
        </div>

        ${record.medical_conditions ? `
        <div class="section">
            <h2>Medical Conditions</h2>
            <p>${record.medical_conditions}</p>
        </div>
        ` : ''}

        <div style="margin-top: 50px; text-align: center; color: #666; font-size: 12px;">
            <p>Generated on: ${new Date().toLocaleDateString()} | ${record.school_name || 'School Management System'}</p>
        </div>
    </body>
    </html>
    `;
}
