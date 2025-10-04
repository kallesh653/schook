
const Attendance = require('../model/attendance.model');
const moment = require('moment')
module.exports = {
    markAttendance: async (req, res) => {
        const { studentId, date, status, classId } = req.body;
        const schoolId = req.user.schoolId;
        try {
          const attendance = new Attendance({ student: studentId, date, status,class:classId, school:schoolId});
          await attendance.save();
          res.status(201).json(attendance);
        } catch (err) {
          res.status(500).json({ message: 'Error marking attendance', err });
        }
      },
      getAttendance: async (req, res) => {
        const { studentId } = req.params;
        
        try {
          const attendance = await Attendance.find({ student: studentId }).populate('student');
          res.status(200).json(attendance);
        } catch (err) {
            console.log(err)
          res.status(500).json({ message: 'Error fetching attendance', err });
        }
      }
    ,
    // Check if attendance is already taken for today
   checkAttendance:  async (req, res) => {
    try {
      const today = moment().startOf('day'); // Get the start of today (00:00:00)
      
      // Query the database for any attendance record for today
      const attendanceForToday = await Attendance.findOne({
        class:req.params.classId,
        date: {
          $gte: today.toDate(), // Check if attendance date is greater than or equal to today's date
          $lt: moment(today).endOf('day').toDate(), // Less than the end of today
        },
      });
  
      if (attendanceForToday) {
        return res.status(200).json({attendanceTaken:true, message: 'Attendance already taken for today' });
      } else {
        return res.status(200).json({ message: 'No attendance taken yet for today' });
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
      return res.status(500).json({ message: 'Server error', error });
    }
}
      ,
    // Get attendance report - fetch all attendance data with filtering options
    getAttendanceReport: async (req, res) => {
        const schoolId = req.user.schoolId;
        const { classId, dateFrom, dateTo, studentId, status } = req.query;

        try {
            let filter = { school: schoolId };

            if (classId) {
                filter.class = classId;
            }

            if (studentId) {
                filter.student = studentId;
            }

            if (status) {
                filter.status = status;
            }

            if (dateFrom && dateTo) {
                filter.date = {
                    $gte: new Date(dateFrom),
                    $lte: new Date(dateTo)
                };
            } else if (dateFrom) {
                filter.date = { $gte: new Date(dateFrom) };
            } else if (dateTo) {
                filter.date = { $lte: new Date(dateTo) };
            }

            const attendanceData = await Attendance.find(filter)
                .populate('student', 'name admission_number guardian_phone gender')
                .populate('class', 'class_text')
                .sort({ date: -1 });

            res.status(200).json({
                success: true,
                data: attendanceData,
                count: attendanceData.length
            });
        } catch (err) {
            console.error('Error fetching attendance report:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching attendance report',
                error: err.message
            });
        }
    },

    // Get attendance summary statistics
    getAttendanceSummary: async (req, res) => {
        const schoolId = req.user.schoolId;
        const { classId, dateFrom, dateTo } = req.query;

        try {
            let matchFilter = { school: schoolId };

            if (classId) {
                matchFilter.class = classId;
            }

            if (dateFrom && dateTo) {
                matchFilter.date = {
                    $gte: new Date(dateFrom),
                    $lte: new Date(dateTo)
                };
            }

            const summaryData = await Attendance.aggregate([
                { $match: matchFilter },
                {
                    $group: {
                        _id: {
                            student: '$student',
                            status: '$status'
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: '$_id.student',
                        totalPresent: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$_id.status', 'Present'] },
                                    '$count',
                                    0
                                ]
                            }
                        },
                        totalAbsent: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$_id.status', 'Absent'] },
                                    '$count',
                                    0
                                ]
                            }
                        },
                        totalDays: { $sum: '$count' }
                    }
                },
                {
                    $lookup: {
                        from: 'students',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'studentInfo'
                    }
                },
                {
                    $unwind: '$studentInfo'
                },
                {
                    $lookup: {
                        from: 'classes',
                        localField: 'studentInfo.student_class',
                        foreignField: '_id',
                        as: 'classInfo'
                    }
                },
                {
                    $unwind: '$classInfo'
                },
                {
                    $addFields: {
                        attendancePercentage: {
                            $multiply: [
                                { $divide: ['$totalPresent', '$totalDays'] },
                                100
                            ]
                        }
                    }
                },
                {
                    $sort: { 'studentInfo.name': 1 }
                }
            ]);

            res.status(200).json({
                success: true,
                data: summaryData,
                count: summaryData.length
            });
        } catch (err) {
            console.error('Error fetching attendance summary:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching attendance summary',
                error: err.message
            });
        }
    }
}
