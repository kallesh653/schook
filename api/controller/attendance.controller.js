
const Attendance = require('../model/attendance.model');
const moment = require('moment');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
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
    },

    // Export attendance report to Excel
    exportAttendanceExcel: async (req, res) => {
        const schoolId = req.user.schoolId;
        const { classId, dateFrom, dateTo, studentId, status } = req.query;

        try {
            let filter = { school: schoolId };

            if (classId) filter.class = classId;
            if (studentId) filter.student = studentId;
            if (status) filter.status = status;

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
                .populate('student', 'name admission_number guardian_phone gender email')
                .populate('class', 'class_text')
                .sort({ date: -1 });

            // Create workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Attendance Report');

            // Add title
            worksheet.mergeCells('A1:G1');
            worksheet.getCell('A1').value = 'Attendance Report';
            worksheet.getCell('A1').font = { size: 16, bold: true };
            worksheet.getCell('A1').alignment = { horizontal: 'center' };

            // Add date range
            worksheet.mergeCells('A2:G2');
            const dateRange = dateFrom && dateTo ?
                `From: ${moment(dateFrom).format('DD/MM/YYYY')} To: ${moment(dateTo).format('DD/MM/YYYY')}` :
                `Generated on: ${moment().format('DD/MM/YYYY HH:mm')}`;
            worksheet.getCell('A2').value = dateRange;
            worksheet.getCell('A2').alignment = { horizontal: 'center' };

            // Add headers
            worksheet.addRow([]);
            const headerRow = worksheet.addRow([
                'S.No',
                'Date',
                'Student Name',
                'Admission No',
                'Class',
                'Status',
                'Guardian Phone'
            ]);

            headerRow.font = { bold: true };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' }
            };

            // Add data
            attendanceData.forEach((record, index) => {
                worksheet.addRow([
                    index + 1,
                    moment(record.date).format('DD/MM/YYYY'),
                    record.student?.name || 'N/A',
                    record.student?.admission_number || 'N/A',
                    record.class?.class_text || 'N/A',
                    record.status,
                    record.student?.guardian_phone || 'N/A'
                ]);
            });

            // Set column widths
            worksheet.columns = [
                { width: 8 },  // S.No
                { width: 15 }, // Date
                { width: 25 }, // Student Name
                { width: 15 }, // Admission No
                { width: 15 }, // Class
                { width: 12 }, // Status
                { width: 15 }  // Guardian Phone
            ];

            // Add borders
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 2) {
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                }
            });

            // Send file
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=attendance_report_${moment().format('YYYYMMDD')}.xlsx`
            );

            await workbook.xlsx.write(res);
            res.end();

        } catch (err) {
            console.error('Error exporting attendance to Excel:', err);
            res.status(500).json({
                success: false,
                message: 'Error exporting attendance report',
                error: err.message
            });
        }
    },

    // Export attendance report to PDF
    exportAttendancePDF: async (req, res) => {
        const schoolId = req.user.schoolId;
        const { classId, dateFrom, dateTo, studentId, status } = req.query;

        try {
            let filter = { school: schoolId };

            if (classId) filter.class = classId;
            if (studentId) filter.student = studentId;
            if (status) filter.status = status;

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

            // Create PDF document
            const doc = new PDFDocument({ margin: 50, size: 'A4' });

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=attendance_report_${moment().format('YYYYMMDD')}.pdf`
            );

            // Pipe PDF to response
            doc.pipe(res);

            // Add title
            doc.fontSize(20).font('Helvetica-Bold').text('Attendance Report', { align: 'center' });
            doc.moveDown();

            // Add date range
            const dateRange = dateFrom && dateTo ?
                `From: ${moment(dateFrom).format('DD/MM/YYYY')} To: ${moment(dateTo).format('DD/MM/YYYY')}` :
                `Generated on: ${moment().format('DD/MM/YYYY HH:mm')}`;
            doc.fontSize(12).font('Helvetica').text(dateRange, { align: 'center' });
            doc.moveDown();

            // Add summary
            const totalRecords = attendanceData.length;
            const presentCount = attendanceData.filter(r => r.status === 'Present').length;
            const absentCount = attendanceData.filter(r => r.status === 'Absent').length;

            doc.fontSize(10).font('Helvetica-Bold').text(`Total Records: ${totalRecords} | Present: ${presentCount} | Absent: ${absentCount}`, { align: 'center' });
            doc.moveDown();

            // Table headers
            const tableTop = doc.y;
            const colWidths = {
                sno: 40,
                date: 80,
                name: 140,
                admission: 80,
                class: 60,
                status: 70
            };

            doc.fontSize(9).font('Helvetica-Bold');
            doc.text('S.No', 50, tableTop, { width: colWidths.sno });
            doc.text('Date', 90, tableTop, { width: colWidths.date });
            doc.text('Student Name', 170, tableTop, { width: colWidths.name });
            doc.text('Adm. No', 310, tableTop, { width: colWidths.admission });
            doc.text('Class', 390, tableTop, { width: colWidths.class });
            doc.text('Status', 450, tableTop, { width: colWidths.status });

            // Draw line under header
            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

            // Table data
            let yPos = tableTop + 20;
            doc.font('Helvetica').fontSize(8);

            attendanceData.forEach((record, index) => {
                if (yPos > 700) {
                    doc.addPage();
                    yPos = 50;
                }

                doc.text(index + 1, 50, yPos, { width: colWidths.sno });
                doc.text(moment(record.date).format('DD/MM/YY'), 90, yPos, { width: colWidths.date });
                doc.text(record.student?.name || 'N/A', 170, yPos, { width: colWidths.name });
                doc.text(record.student?.admission_number || 'N/A', 310, yPos, { width: colWidths.admission });
                doc.text(record.class?.class_text || 'N/A', 390, yPos, { width: colWidths.class });
                doc.text(record.status, 450, yPos, { width: colWidths.status });

                yPos += 20;
            });

            // Add footer
            doc.fontSize(8).text(
                `Generated by School Management System on ${moment().format('DD/MM/YYYY HH:mm')}`,
                50,
                doc.page.height - 50,
                { align: 'center' }
            );

            // Finalize PDF
            doc.end();

        } catch (err) {
            console.error('Error exporting attendance to PDF:', err);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Error exporting attendance report',
                    error: err.message
                });
            }
        }
    }
}
