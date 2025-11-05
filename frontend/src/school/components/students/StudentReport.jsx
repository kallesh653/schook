import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Grid,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip
} from '@mui/material';
import {
    Download as DownloadIcon,
    Close as CloseIcon,
    Print as PrintIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { baseUrl } from '../../../environment';

const StudentReport = ({ open, onClose, student }) => {
    const [marksheets, setMarksheets] = useState([]);
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && student) {
            fetchStudentData();
        }
    }, [open, student]);

    const fetchStudentData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            // Fetch marksheets
            const marksheetResponse = await axios.get(`${baseUrl}/marksheets?limit=1000`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const allMarksheets = marksheetResponse.data.data || [];
            const studentMarksheets = allMarksheets.filter(
                ms => ms.student_name === student.name
            );
            setMarksheets(studentMarksheets);

            // Fetch attendance data
            try {
                const attendanceResponse = await axios.get(
                    `${baseUrl}/attendance/student/${student._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAttendance(attendanceResponse.data.data);
            } catch (err) {
                console.log('Attendance not available');
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAttendancePercentage = () => {
        if (!attendance || !attendance.records) return 0;
        const present = attendance.records.filter(r => r.status === 'present').length;
        const total = attendance.records.length;
        return total > 0 ? ((present / total) * 100).toFixed(2) : 0;
    };

    const calculateOverallPerformance = () => {
        if (marksheets.length === 0) return { avg: 0, grade: 'N/A' };
        const totalPercentage = marksheets.reduce((sum, ms) => sum + (ms.percentage || 0), 0);
        const avg = totalPercentage / marksheets.length;
        const grade = getGrade(avg);
        return { avg: avg.toFixed(2), grade };
    };

    const getGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        if (percentage >= 40) return 'D';
        return 'F';
    };

    const generateProfessionalReport = () => {
        const doc = new jsPDF();
        let yPos = 20;

        // ===== HEADER =====
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, 210, 45, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(26);
        doc.setFont(undefined, 'bold');
        doc.text('COMPREHENSIVE STUDENT REPORT', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Academic & Performance Analysis', 105, 30, { align: 'center' });
        doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 37, { align: 'center' });

        yPos = 55;

        // ===== STUDENT INFORMATION SECTION =====
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(240, 248, 255);
        doc.roundedRect(15, yPos, 180, 8, 2, 2, 'F');
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('STUDENT INFORMATION', 20, yPos + 6);
        yPos += 15;

        // Two-column layout for student details
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const leftCol = 20;
        const rightCol = 110;
        const labelWidth = 45;

        const studentInfo = [
            { label: 'Full Name:', value: student.name || 'N/A', col: 'left' },
            { label: 'Student ID:', value: student._id?.slice(-8).toUpperCase() || 'N/A', col: 'right' },
            { label: 'Roll Number:', value: student.roll_number || 'N/A', col: 'left' },
            { label: 'Class & Section:', value: `${student.student_class?.class_text || 'N/A'}`, col: 'right' },
            { label: 'Date of Birth:', value: student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A', col: 'left' },
            { label: 'Age:', value: student.age || 'N/A', col: 'right' },
            { label: 'Gender:', value: student.gender || 'N/A', col: 'left' },
            { label: 'Blood Group:', value: student.blood_group || 'N/A', col: 'right' },
            { label: 'Phone:', value: student.phone || 'N/A', col: 'left' },
            { label: 'Email:', value: student.email || 'N/A', col: 'right' },
            { label: 'Address:', value: student.address || 'N/A', col: 'left' },
            { label: 'City:', value: student.city || 'N/A', col: 'right' },
        ];

        let leftYPos = yPos;
        let rightYPos = yPos;

        studentInfo.forEach(info => {
            if (info.col === 'left') {
                doc.setFont(undefined, 'bold');
                doc.text(info.label, leftCol, leftYPos);
                doc.setFont(undefined, 'normal');
                doc.text(String(info.value), leftCol + labelWidth, leftYPos);
                leftYPos += 7;
            } else {
                doc.setFont(undefined, 'bold');
                doc.text(info.label, rightCol, rightYPos);
                doc.setFont(undefined, 'normal');
                doc.text(String(info.value), rightCol + labelWidth, rightYPos);
                rightYPos += 7;
            }
        });

        yPos = Math.max(leftYPos, rightYPos) + 5;

        // ===== GUARDIAN INFORMATION =====
        doc.setFillColor(240, 248, 255);
        doc.roundedRect(15, yPos, 180, 8, 2, 2, 'F');
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('GUARDIAN INFORMATION', 20, yPos + 6);
        yPos += 15;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const guardianInfo = [
            { label: 'Guardian Name:', value: student.guardian_name || 'N/A' },
            { label: 'Relationship:', value: student.guardian_relationship || 'N/A' },
            { label: 'Guardian Phone:', value: student.guardian_phone || 'N/A' },
            { label: 'Guardian Email:', value: student.guardian_email || 'N/A' },
        ];

        guardianInfo.forEach(info => {
            doc.setFont(undefined, 'bold');
            doc.text(info.label, leftCol, yPos);
            doc.setFont(undefined, 'normal');
            doc.text(String(info.value), leftCol + labelWidth, yPos);
            yPos += 7;
        });

        yPos += 5;

        // ===== ACADEMIC PERFORMANCE =====
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFillColor(240, 248, 255);
        doc.roundedRect(15, yPos, 180, 8, 2, 2, 'F');
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('ACADEMIC PERFORMANCE', 20, yPos + 6);
        yPos += 15;

        if (marksheets.length > 0) {
            const examData = marksheets.map((ms, index) => [
                String(index + 1),
                ms.examination || 'Exam',
                ms.academic_year || 'N/A',
                `${ms.total_marks || 0}/${ms.total_max_marks || 0}`,
                `${ms.percentage || 0}%`,
                ms.overall_grade || 'N/A',
                ms.result || 'N/A'
            ]);

            doc.autoTable({
                startY: yPos,
                head: [['#', 'Examination', 'Year', 'Marks', 'Percentage', 'Grade', 'Result']],
                body: examData,
                theme: 'grid',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                    fontSize: 10
                },
                bodyStyles: {
                    fontSize: 9,
                    halign: 'center'
                },
                columnStyles: {
                    0: { cellWidth: 10 },
                    1: { cellWidth: 40, halign: 'left' },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 20 },
                    6: { cellWidth: 25 }
                },
                margin: { left: 15, right: 15 }
            });

            yPos = doc.lastAutoTable.finalY + 10;

            // Overall Performance Box
            const performance = calculateOverallPerformance();
            doc.setFillColor(230, 245, 255);
            doc.roundedRect(15, yPos, 180, 25, 3, 3, 'F');

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(41, 128, 185);
            doc.text('Overall Academic Performance', 105, yPos + 8, { align: 'center' });

            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text(`Average Percentage: ${performance.avg}%`, 50, yPos + 16);
            doc.text(`Overall Grade: ${performance.grade}`, 130, yPos + 16);
            doc.text(`Total Examinations: ${marksheets.length}`, 90, yPos + 22);

            yPos += 32;
        } else {
            doc.setFontSize(10);
            doc.setFont(undefined, 'italic');
            doc.setTextColor(128, 128, 128);
            doc.text('No examination records available', 105, yPos, { align: 'center' });
            yPos += 15;
        }

        // ===== ATTENDANCE SUMMARY =====
        if (yPos > 220) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFillColor(240, 248, 255);
        doc.roundedRect(15, yPos, 180, 8, 2, 2, 'F');
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('ATTENDANCE SUMMARY', 20, yPos + 6);
        yPos += 15;

        if (attendance && attendance.records) {
            const present = attendance.records.filter(r => r.status === 'present').length;
            const absent = attendance.records.filter(r => r.status === 'absent').length;
            const total = attendance.records.length;
            const percentage = calculateAttendancePercentage();

            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.text('Total Days:', leftCol, yPos);
            doc.setFont(undefined, 'normal');
            doc.text(String(total), leftCol + labelWidth, yPos);
            yPos += 7;

            doc.setFont(undefined, 'bold');
            doc.text('Present:', leftCol, yPos);
            doc.setFont(undefined, 'normal');
            doc.text(String(present), leftCol + labelWidth, yPos);
            yPos += 7;

            doc.setFont(undefined, 'bold');
            doc.text('Absent:', leftCol, yPos);
            doc.setFont(undefined, 'normal');
            doc.text(String(absent), leftCol + labelWidth, yPos);
            yPos += 7;

            doc.setFont(undefined, 'bold');
            doc.text('Attendance %:', leftCol, yPos);
            doc.setFont(undefined, 'normal');
            doc.text(`${percentage}%`, leftCol + labelWidth, yPos);
            yPos += 10;

            // Attendance status box
            const attendanceColor = percentage >= 75 ? [76, 175, 80] : percentage >= 60 ? [255, 152, 0] : [244, 67, 54];
            doc.setFillColor(...attendanceColor);
            doc.roundedRect(15, yPos, 180, 15, 3, 3, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            const attendanceStatus = percentage >= 75 ? 'EXCELLENT ATTENDANCE' : percentage >= 60 ? 'SATISFACTORY ATTENDANCE' : 'NEEDS IMPROVEMENT';
            doc.text(attendanceStatus, 105, yPos + 10, { align: 'center' });
            yPos += 22;
        } else {
            doc.setFontSize(10);
            doc.setFont(undefined, 'italic');
            doc.setTextColor(128, 128, 128);
            doc.text('No attendance records available', 105, yPos, { align: 'center' });
            yPos += 15;
        }

        // ===== FEES INFORMATION =====
        if (yPos > 220) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFillColor(240, 248, 255);
        doc.roundedRect(15, yPos, 180, 8, 2, 2, 'F');
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('FEES INFORMATION', 20, yPos + 6);
        yPos += 15;

        const totalFees = student.fees?.total_fees || 0;
        const advanceFees = student.fees?.advance_fees || 0;
        const balanceFees = student.fees?.balance_fees || 0;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('Total Fees:', leftCol, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(`₹${totalFees}`, leftCol + labelWidth, yPos);
        yPos += 7;

        doc.setFont(undefined, 'bold');
        doc.text('Advance Paid:', leftCol, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(`₹${advanceFees}`, leftCol + labelWidth, yPos);
        yPos += 7;

        doc.setFont(undefined, 'bold');
        doc.text('Balance Due:', leftCol, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(`₹${balanceFees}`, leftCol + labelWidth, yPos);
        yPos += 10;

        // Fees status box
        const feesColor = balanceFees === 0 ? [76, 175, 80] : balanceFees <= totalFees * 0.3 ? [255, 152, 0] : [244, 67, 54];
        doc.setFillColor(...feesColor);
        doc.roundedRect(15, yPos, 180, 15, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        const feesStatus = balanceFees === 0 ? 'FEES FULLY PAID' : balanceFees <= totalFees * 0.3 ? 'MINIMAL BALANCE REMAINING' : 'PAYMENT PENDING';
        doc.text(feesStatus, 105, yPos + 10, { align: 'center' });
        yPos += 22;

        // ===== FOOTER =====
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFillColor(240, 240, 240);
            doc.rect(0, 287, 210, 10, 'F');
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Comprehensive Student Report - ${student.name}`, 15, 293);
            doc.text(`Page ${i} of ${pageCount}`, 180, 293);
            doc.setTextColor(128, 128, 128);
            doc.text('This is a system-generated confidential document', 105, 293, { align: 'center' });
        }

        // Save
        doc.save(`Student_Report_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const performance = calculateOverallPerformance();
    const attendancePercentage = calculateAttendancePercentage();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #2980b9 0%, #2c3e50 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h6">Student Professional Report</Typography>
                <Button
                    onClick={onClose}
                    sx={{ color: 'white', minWidth: 'auto' }}
                >
                    <CloseIcon />
                </Button>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography>Loading report data...</Typography>
                    </Box>
                ) : (
                    <Box>
                        {/* Student Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Avatar
                                src={student.student_image ? `/images/uploaded/student/${student.student_image}` : undefined}
                                sx={{ width: 80, height: 80, border: '3px solid #2980b9' }}
                            >
                                {student.name?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2980b9' }}>
                                    {student.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Roll: {student.roll_number} | Class: {student.student_class?.class_text}
                                </Typography>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Chip label={student.gender || 'N/A'} size="small" color="primary" />
                                    <Chip label={`Age: ${student.age || 'N/A'}`} size="small" />
                                </Box>
                            </Box>
                        </Box>

                        {/* Quick Stats */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2980b9' }}>
                                        {performance.avg}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Avg Performance</Typography>
                                    <Chip label={`Grade: ${performance.grade}`} size="small" sx={{ mt: 1 }} />
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                        {attendancePercentage}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Attendance</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                                        ₹{student.fees?.balance_fees || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Balance Fees</Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Exam History */}
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Academic Performance
                        </Typography>
                        {marksheets.length > 0 ? (
                            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Exam</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Year</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Marks</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>%</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Grade</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {marksheets.map((ms, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{ms.examination || 'Exam'}</TableCell>
                                                <TableCell>{ms.academic_year || 'N/A'}</TableCell>
                                                <TableCell>{ms.total_marks}/{ms.total_max_marks}</TableCell>
                                                <TableCell>{ms.percentage}%</TableCell>
                                                <TableCell>
                                                    <Chip label={ms.overall_grade} size="small" color="primary" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                No examination records available
                            </Typography>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    startIcon={<CloseIcon />}
                >
                    Close
                </Button>
                <Button
                    variant="contained"
                    onClick={generateProfessionalReport}
                    startIcon={<DownloadIcon />}
                    sx={{ background: 'linear-gradient(135deg, #2980b9 0%, #2c3e50 100%)' }}
                    disabled={loading}
                >
                    Download Report
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentReport;
