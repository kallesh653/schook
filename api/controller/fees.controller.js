const Fees = require('../model/fees.model');
const Student = require('../model/student.model');

module.exports = {
    // Get dashboard statistics
    getDashboardStats: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            
            // Get total fees for the school
            const totalFeesResult = await Fees.aggregate([
                { $match: { school: schoolId } },
                { $group: { _id: null, total: { $sum: '$total_fees' } } }
            ]);
            
            // Get collected fees for the school
            const collectedFeesResult = await Fees.aggregate([
                { $match: { school: schoolId } },
                { $group: { _id: null, total: { $sum: '$paid_amount' } } }
            ]);
            
            // Get today's collected fees
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const todayCollectedResult = await Fees.aggregate([
                { 
                    $match: { 
                        school: schoolId,
                        payment_date: { $gte: today, $lt: tomorrow }
                    } 
                },
                { $group: { _id: null, total: { $sum: '$paid_amount' } } }
            ]);
            
            // Get balance fees
            const balanceFeesResult = await Fees.aggregate([
                { $match: { school: schoolId } },
                { $group: { _id: null, total: { $sum: '$balance_amount' } } }
            ]);
            
            const stats = {
                totalFees: totalFeesResult[0]?.total || 0,
                collectedFees: collectedFeesResult[0]?.total || 0,
                todayCollected: todayCollectedResult[0]?.total || 0,
                balanceFees: balanceFeesResult[0]?.total || 0
            };
            
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            console.log('Error in getDashboardStats:', error);
            res.status(500).json({ success: false, message: 'Server Error in getting dashboard stats' });
        }
    },

    // Get attendance statistics
    getAttendanceStats: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            
            // Get today's date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Get total students
            const totalStudents = await Student.countDocuments({ school: schoolId });
            
            // Get present students today
            const Attendance = require('../model/attendance.model');
            const presentToday = await Attendance.countDocuments({
                school: schoolId,
                date: { $gte: today, $lt: tomorrow },
                status: 'Present'
            });
            
            // Get absent students today
            const absentToday = await Attendance.countDocuments({
                school: schoolId,
                date: { $gte: today, $lt: tomorrow },
                status: 'Absent'
            });
            
            const attendanceStats = {
                totalStudents,
                presentToday,
                absentToday,
                attendancePercentage: totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0
            };
            
            res.status(200).json({ success: true, data: attendanceStats });
        } catch (error) {
            console.log('Error in getAttendanceStats:', error);
            res.status(500).json({ success: false, message: 'Server Error in getting attendance stats' });
        }
    },

    // Create or update fees record
    createFees: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const feesData = { ...req.body, school: schoolId };
            
            const newFees = new Fees(feesData);
            const savedFees = await newFees.save();
            
            res.status(201).json({ 
                success: true, 
                message: 'Fees record created successfully',
                data: savedFees 
            });
        } catch (error) {
            console.log('Error in createFees:', error);
            res.status(500).json({ success: false, message: 'Error creating fees record' });
        }
    },

    // Update payment
    updatePayment: async (req, res) => {
        try {
            const { id } = req.params;
            const { paid_amount, payment_method, payment_date, remarks } = req.body;
            
            const fees = await Fees.findById(id);
            if (!fees) {
                return res.status(404).json({ success: false, message: 'Fees record not found' });
            }
            
            fees.paid_amount = paid_amount;
            fees.payment_method = payment_method;
            fees.payment_date = payment_date || new Date();
            fees.remarks = remarks;
            
            await fees.save();
            
            res.status(200).json({ 
                success: true, 
                message: 'Payment updated successfully',
                data: fees 
            });
        } catch (error) {
            console.log('Error in updatePayment:', error);
            res.status(500).json({ success: false, message: 'Error updating payment' });
        }
    }
};
