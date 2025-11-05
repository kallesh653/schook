import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
    Grid,
    Card,
    CardContent,
    Alert,
    Divider,
    Snackbar,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Payment as PaymentIcon,
    Receipt as ReceiptIcon,
    AccountBalance as AccountBalanceIcon,
    TrendingUp as TrendingUpIcon,
    Search as SearchIcon,
    Person as PersonIcon,
    Send as SendIcon,
    Notifications as NotificationsIcon,
    Calculate as CalculateIcon
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import { useLocation } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";

const FeesManagement = () => {
    console.log('FeesManagement component is loading...');

    const { isSuperAdmin, hasPermission } = useContext(AuthContext);
    const canDelete = isSuperAdmin() || hasPermission('can_delete_records');
    const location = useLocation();
    const [fees, setFees] = useState(() => {
        // Load fees from localStorage on component mount
        try {
            const savedFees = localStorage.getItem('feesManagement_fees');
            return savedFees ? JSON.parse(savedFees) : [];
        } catch (error) {
            console.error('Error loading fees from localStorage:', error);
            return [];
        }
    });
    const [students, setStudents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingFee, setEditingFee] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openStudentDialog, setOpenStudentDialog] = useState(false);
    const [openMessageDialog, setOpenMessageDialog] = useState(false);
    const [messageData, setMessageData] = useState({
        recipient: '',
        subject: '',
        message: '',
        type: 'fee_reminder'
    });
    const [formData, setFormData] = useState({
        studentId: '',
        studentName: '',
        feeType: '',
        customFeeType: '', // For manual fee type entry
        amount: '',
        dueDate: '',
        status: 'pending',
        description: '',
        section: ''
    });

    // Multiple fees state for bulk addition
    const [multipleFees, setMultipleFees] = useState([]);
    const [openMultipleFeesDialog, setOpenMultipleFeesDialog] = useState(false);
    const [multipleFeesStudentId, setMultipleFeesStudentId] = useState('');

    // Custom fee entry state
    const [customFeeEntry, setCustomFeeEntry] = useState({
        section: '',
        feeType: '',
        amount: '',
        description: ''
    });
    const [showCustomFeeForm, setShowCustomFeeForm] = useState(false);

    // Student selection dialog for multiple fees
    const [openStudentSelectionDialog, setOpenStudentSelectionDialog] = useState(false);

    // Professional fee structure organized by categories
    const feeStructure = {
        '🎓 Academic & Educational': {
            'Tuition Fee': { monthly: 5000, quarterly: 14000, annual: 50000 },
            'Admission Fee': { oneTime: 10000 },
            'Registration Fee': { annual: 2000 },
            'Examination Fee': { semester: 1500, annual: 2500 },
            'Laboratory Fee': { semester: 3000, annual: 5000 },
            'Library Fee': { annual: 1500 },
            'Computer Lab Fee': { annual: 4000 },
            'Course Material Fee': { semester: 2000, annual: 3500 }
        },
        '🚌 Transportation Services': {
            'Bus Transportation - Zone A (0-5km)': { monthly: 2000, annual: 20000 },
            'Bus Transportation - Zone B (5-10km)': { monthly: 2500, annual: 25000 },
            'Bus Transportation - Zone C (10km+)': { monthly: 3000, annual: 30000 },
            'Van Service': { monthly: 1500, annual: 15000 },
            'Fuel Surcharge': { monthly: 300, annual: 3200 }
        },
        '🏢 Infrastructure & Facilities': {
            'Development Fund': { annual: 5000 },
            'Maintenance Fee': { annual: 3000 },
            'Security & Safety Fee': { annual: 1000 },
            'Utility Charges': { monthly: 500, annual: 5500 },
            'Campus Beautification': { annual: 1200 },
            'Equipment Upgrade Fund': { annual: 2500 }
        },
        '🎨 Co-curricular Activities': {
            'Sports & Athletics Fee': { annual: 2500 },
            'Cultural Activities Fee': { annual: 1500 },
            'Field Trip & Excursions': { perTrip: 1000 },
            'Annual Day Function': { annual: 800 },
            'Science Exhibition': { annual: 500 },
            'Arts & Crafts Program': { annual: 1200 },
            'Music & Dance Classes': { monthly: 800, annual: 8500 }
        },
        '🏠 Hostel & Accommodation': {
            'Hostel Accommodation': { monthly: 8000, annual: 80000 },
            'Mess & Dining Fee': { monthly: 4000, annual: 40000 },
            'Hostel Security Deposit': { oneTime: 10000 },
            'Laundry Services': { monthly: 500, annual: 5000 },
            'Hostel Maintenance': { annual: 2000 }
        },
        '📋 Administrative & Miscellaneous': {
            'Student ID Card': { oneTime: 200 },
            'School Uniform': { annual: 3000 },
            'Books & Stationery': { annual: 5000 },
            'Medical & Health Checkup': { annual: 1000 },
            'Student Insurance': { annual: 800 },
            'Late Payment Penalty': { perDay: 50 },
            'Re-examination Fee': { perSubject: 500 },
            'Transfer Certificate': { oneTime: 300 }
        },
        '💰 Package Deals': {
            'Complete Annual Package': { annual: 75000 },
            'Academic Semester Package': { semester: 40000 },
            'Monthly Basic Package': { monthly: 8000 },
            'Quarterly Standard Package': { quarterly: 22000 },
            'Premium All-Inclusive Package': { annual: 95000 }
        }
    };

    // Fetch students from API
    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get(`${baseUrl}/student/fetch-with-query`, { headers });
            const studentRecords = response.data.data || [];

            // Transform students to match fees component format
            const transformedStudents = studentRecords.map(record => ({
                id: record._id,
                name: record.name,
                class: record.student_class?.class_text || record.class || '',
                section: record.student_class?.section || record.section || '',
                rollNumber: record.roll_number,
                phone: record.guardian_phone,
                email: record.email,
                fees: record.fees || {}
            }));
            
            setStudents(transformedStudents);

            // Generate fees from students only if no saved fees exist
            const savedFees = localStorage.getItem('feesManagement_fees');
            if (!savedFees || JSON.parse(savedFees).length === 0) {
                generateFeesFromStudents(transformedStudents);
            }
            
        } catch (error) {
            console.error('Error fetching students:', error);
            setSnackbar({ 
                open: true, 
                message: 'Error fetching students: ' + (error.response?.data?.message || error.message), 
                severity: 'error' 
            });
        }
    };

    // Update student fees automatically
    const updateStudentRecordFees = async (studentId, feeAmount, action, feeType = null) => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            // Get current student
            const student = students.find(s => s.id === studentId);
            if (!student) {
                throw new Error('Student not found');
            }

            // Calculate new fee values based on action
            let updatedFees = { ...student.fees };

            if (action === 'add') {
                updatedFees.total_fees = (updatedFees.total_fees || 0) + feeAmount;

                // Special handling for transport fees
                if (feeType && feeType.toLowerCase().includes('transport') || feeType && feeType.toLowerCase().includes('bus')) {
                    updatedFees.transport_fees = (updatedFees.transport_fees || 0) + feeAmount;
                }
            } else if (action === 'pay') {
                updatedFees.paid_fees = (updatedFees.paid_fees || 0) + feeAmount;
            } else if (action === 'remove') {
                updatedFees.total_fees = Math.max(0, (updatedFees.total_fees || 0) - feeAmount);

                // Special handling for transport fees removal
                if (feeType && feeType.toLowerCase().includes('transport') || feeType && feeType.toLowerCase().includes('bus')) {
                    updatedFees.transport_fees = Math.max(0, (updatedFees.transport_fees || 0) - feeAmount);
                }
            }

            // Recalculate balance
            updatedFees.balance_fees = updatedFees.total_fees - updatedFees.paid_fees;

            // Update student in backend
            await axios.patch(`${baseUrl}/student/update/${studentId}`, {
                fees: updatedFees
            }, { headers });

            // Update local students state
            setStudents(prev => prev.map(student =>
                student.id === studentId
                    ? { ...student, fees: updatedFees }
                    : student
            ));

            console.log('Student fees updated successfully');
        } catch (error) {
            console.error('Error updating student fees:', error);
            throw error;
        }
    };

    // Generate fees from students
    const generateFeesFromStudents = (studentRecords) => {
        const generatedFees = [];
        let feeId = 1;

        studentRecords.forEach(student => {
            if (student.fees) {
                // Generate fees based on student fees
                Object.entries(student.fees).forEach(([feeKey, amount]) => {
                    if (amount > 0 && !['paid_fees', 'total_fees', 'balance_fees'].includes(feeKey)) {
                        const feeTypeMap = {
                            'tuition_fees': { section: 'Academic Fees', type: 'Tuition Fee' },
                            'transport_fees': { section: 'Transport Fees', type: 'Bus Fee Zone 1' },
                            'hostel_fees': { section: 'Hostel Fees', type: 'Hostel Accommodation' },
                            'library_fees': { section: 'Academic Fees', type: 'Library Fee' },
                            'lab_fees': { section: 'Academic Fees', type: 'Lab Fee' },
                            'sports_fees': { section: 'Activity Fees', type: 'Sports Fee' },
                            'examination_fees': { section: 'Academic Fees', type: 'Examination Fee' },
                            'miscellaneous_fees': { section: 'Miscellaneous Fees', type: 'Miscellaneous' }
                        };

                        const feeMapping = feeTypeMap[feeKey];
                        if (feeMapping) {
                            const balanceAmount = amount - (student.fees.paid_fees || 0);
                            const status = balanceAmount <= 0 ? 'paid' : 
                                         new Date() > new Date('2024-02-01') ? 'overdue' : 'pending';

                            generatedFees.push({
                                id: feeId++,
                                studentId: student.id,
                                studentName: student.name,
                                section: feeMapping.section,
                                feeType: feeMapping.type,
                                amount: amount,
                                dueDate: '2024-02-01',
                                status: status,
                                description: `${feeMapping.type} for ${student.name}`,
                                paidDate: status === 'paid' ? '2024-01-15' : null
                            });
                        }
                    }
                });
            }
        });

        setFees(generatedFees);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Save fees to localStorage whenever fees state changes
    useEffect(() => {
        localStorage.setItem('feesManagement_fees', JSON.stringify(fees));
    }, [fees]);

    // Listen for external fee updates
    useEffect(() => {
        const handleFeesUpdate = () => {
            // Reload fees from localStorage when updated externally
            const savedFees = localStorage.getItem('feesManagement_fees');
            if (savedFees) {
                setFees(JSON.parse(savedFees));
            }
            // Refresh students data
            fetchStudents();
        };

        window.addEventListener('feesUpdated', handleFeesUpdate);
        return () => window.removeEventListener('feesUpdated', handleFeesUpdate);
    }, []);

    // Handle navigation from students
    useEffect(() => {
        if (location.state?.searchStudent) {
            setSearchQuery(location.state.searchStudent);
            // Show snackbar indicating automatic search
            setSnackbar({
                open: true,
                message: `Showing fees for ${location.state.searchStudent}`,
                severity: 'info'
            });
        }
    }, [location.state]);

    const handleOpenDialog = (fee = null) => {
        if (fee) {
            setEditingFee(fee);
            setFormData({
                studentId: fee.studentId,
                studentName: fee.studentName,
                section: fee.section,
                feeType: fee.feeType,
                customFeeType: '',
                amount: fee.amount,
                dueDate: fee.dueDate,
                status: fee.status,
                description: fee.description
            });
        } else {
            setEditingFee(null);
            setFormData({
                studentId: '',
                studentName: '',
                section: '',
                feeType: '',
                customFeeType: '',
                amount: '',
                dueDate: '',
                status: 'pending',
                description: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingFee(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-fill student name when student is selected
        if (name === 'studentId') {
            const selectedStudent = students.find(s => s.id === parseInt(value));
            if (selectedStudent) {
                setFormData(prev => ({
                    ...prev,
                    studentName: selectedStudent.name
                }));
            }
        }

        // Auto-fill amount when fee type is selected and clear custom type
        if (name === 'feeType') {
            if (value) {
                let selectedFee = null;
                let sectionName = formData.section;

                // If section is selected, look in that section
                if (formData.section) {
                    selectedFee = feeStructure[formData.section]?.[value];
                } else {
                    // If no section selected, find the fee type in any section
                    for (const [section, fees] of Object.entries(feeStructure)) {
                        if (fees[value]) {
                            selectedFee = fees[value];
                            sectionName = section;
                            break;
                        }
                    }
                }

                if (selectedFee) {
                    // Get the first available amount option
                    const firstAmountKey = Object.keys(selectedFee)[0];
                    const suggestedAmount = selectedFee[firstAmountKey];
                    setFormData(prev => ({
                        ...prev,
                        customFeeType: '', // Clear custom type when predefined is selected
                        section: sectionName, // Auto-set section if found
                        amount: suggestedAmount,
                        description: `${value} - ${firstAmountKey}`
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        customFeeType: '' // Clear custom type
                    }));
                }
            } else {
                // If no predefined type selected, clear amount and description
                setFormData(prev => ({
                    ...prev,
                    amount: '',
                    description: ''
                }));
            }
        }

        // Clear predefined fee type when custom type is entered
        if (name === 'customFeeType' && value.trim()) {
            setFormData(prev => ({
                ...prev,
                feeType: '' // Clear predefined type when custom is entered
            }));
        }

        // Clear fee type when section changes
        if (name === 'section') {
            setFormData(prev => ({
                ...prev,
                feeType: '',
                customFeeType: '',
                amount: '',
                description: ''
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            if (editingFee) {
                // Update existing fee
                const updatedFee = { ...editingFee, ...formData, amount: parseFloat(formData.amount) };
                setFees(prev => prev.map(fee =>
                    fee.id === editingFee.id ? updatedFee : fee
                ));

                // Update student fees automatically
                await updateStudentRecordFees(formData.studentId, updatedFee.amount, 'update', updatedFee.feeType);
                setSnackbar({ open: true, message: 'Fee updated and synced with student!', severity: 'success' });
            } else {
                // Add new fee
                const finalFeeType = formData.feeType || formData.customFeeType?.trim() || 'Custom Fee';
                const finalSection = formData.section || 'General';
                const newFee = {
                    ...formData,
                    feeType: finalFeeType,
                    section: finalSection,
                    id: Date.now(),
                    amount: parseFloat(formData.amount)
                };
                setFees(prev => [...prev, newFee]);

                // Update student fees automatically
                await updateStudentRecordFees(formData.studentId, newFee.amount, 'add', newFee.feeType);
                setSnackbar({ open: true, message: 'New fee added and synced with student!', severity: 'success' });
            }
            handleCloseDialog();

            // Refresh data to ensure consistency
            setTimeout(() => {
                fetchStudents();
            }, 1000);
        } catch (error) {
            console.error('Error saving fee:', error);
            setSnackbar({ open: true, message: 'Error saving fee: ' + error.message, severity: 'error' });
        }
    };

    const handleDelete = async (feeId) => {
        try {
            const fee = fees.find(f => f.id === feeId);
            if (!fee) return;

            if (window.confirm('Are you sure you want to delete this fee? This will also update the student.')) {
                // Remove fee from list
                setFees(prev => prev.filter(f => f.id !== feeId));

                // Update student by reducing total fees
                await updateStudentRecordFees(fee.studentId, fee.amount, 'remove', fee.feeType);

                setSnackbar({ open: true, message: 'Fee deleted and student updated!', severity: 'success' });

                // Refresh data to ensure consistency
                setTimeout(() => {
                    fetchStudents();
                }, 1000);
            }
        } catch (error) {
            console.error('Error deleting fee:', error);
            setSnackbar({ open: true, message: 'Error deleting fee: ' + error.message, severity: 'error' });
        }
    };

    const handleMarkAsPaid = async (feeId) => {
        try {
            const fee = fees.find(f => f.id === feeId);
            if (!fee) return;

            // Mark fee as paid
            setFees(prev => prev.map(f =>
                f.id === feeId
                    ? { ...f, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
                    : f
            ));

            // Update student with payment
            await updateStudentRecordFees(fee.studentId, fee.amount, 'pay', fee.feeType);
            setSnackbar({ open: true, message: 'Fee marked as paid and synced with student!', severity: 'success' });

            // Refresh data to ensure consistency
            setTimeout(() => {
                fetchStudents();
            }, 1000);
        } catch (error) {
            console.error('Error marking fee as paid:', error);
            setSnackbar({ open: true, message: 'Error updating payment: ' + error.message, severity: 'error' });
        }
    };

    // Student search functionality
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.section?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.class?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate student fee summary - comprehensive calculation
    const calculateStudentFeeSummary = (student) => {
        const studentFees = fees.filter(fee => fee.studentId === student.id);
        const totalFees = studentFees.reduce((sum, fee) => sum + fee.amount, 0);
        const paidFees = studentFees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
        const balanceFees = totalFees - paidFees;

        // Calculate advance fees (if paid more than total)
        const advanceFees = Math.max(0, paidFees - totalFees);
        const remainingFees = Math.max(0, totalFees - paidFees);

        return {
            totalFees,
            paidFees,
            balanceFees,
            advanceFees,
            remainingFees,
            studentFees
        };
    };

    // Handle student selection for detailed view
    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setOpenStudentDialog(true);
    };

    // Handle message sending
    const handleSendMessage = () => {
        setMessageData({
            recipient: selectedStudent?.name || '',
            subject: `Fee Reminder - ${selectedStudent?.name}`,
            message: `Dear ${selectedStudent?.name},\n\nThis is a reminder regarding your pending fees. Please contact the school office for more details.\n\nThank you.`,
            type: 'fee_reminder'
        });
        setOpenMessageDialog(true);
    };

    const handleMessageSubmit = async () => {
        try {
            // Here you would typically send the message via API
            console.log('Sending message:', messageData);
            setSnackbar({ open: true, message: 'Message sent successfully!', severity: 'success' });
            setOpenMessageDialog(false);
            setMessageData({ recipient: '', subject: '', message: '', type: 'fee_reminder' });
        } catch (error) {
            console.error('Error sending message:', error);
            setSnackbar({ open: true, message: 'Error sending message', severity: 'error' });
        }
    };

    // Handle multiple fees functions
    const handleOpenMultipleFeesDialog = (student) => {
        setMultipleFeesStudentId(student.id);

        // Create a curated list of common fees
        const commonFees = [
            { section: '🎓 Academic & Educational', feeType: 'Tuition Fee', amount: 50000, selected: false, icon: '📚' },
            { section: '🎓 Academic & Educational', feeType: 'Laboratory Fee', amount: 5000, selected: false, icon: '🔬' },
            { section: '🎓 Academic & Educational', feeType: 'Library Fee', amount: 1500, selected: false, icon: '📖' },
            { section: '🎓 Academic & Educational', feeType: 'Computer Lab Fee', amount: 4000, selected: false, icon: '💻' },
            { section: '🚌 Transportation Services', feeType: 'Bus Transportation - Zone A (0-5km)', amount: 20000, selected: false, icon: '🚌' },
            { section: '🎨 Co-curricular Activities', feeType: 'Sports & Athletics Fee', amount: 2500, selected: false, icon: '⚽' },
            { section: '🏢 Infrastructure & Facilities', feeType: 'Development Fund', amount: 5000, selected: false, icon: '🏗️' },
            { section: '📋 Administrative & Miscellaneous', feeType: 'School Uniform', amount: 3000, selected: false, icon: '👕' },
            { section: '📋 Administrative & Miscellaneous', feeType: 'Books & Stationery', amount: 5000, selected: false, icon: '📝' },
            { section: '📋 Administrative & Miscellaneous', feeType: 'Student Insurance', amount: 800, selected: false, icon: '🛡️' },
            { section: '💰 Package Deals', feeType: 'Complete Annual Package', amount: 75000, selected: false, icon: '🎁' },
            { section: '💰 Package Deals', feeType: 'Academic Semester Package', amount: 40000, selected: false, icon: '📦' }
        ];

        setMultipleFees(commonFees);
        setOpenMultipleFeesDialog(true);

        // Reset custom fee form
        setCustomFeeEntry({
            section: '',
            feeType: '',
            amount: '',
            description: ''
        });
        setShowCustomFeeForm(false);
    };

    const handleMultipleFeeToggle = (index) => {
        setMultipleFees(prev =>
            prev.map((fee, i) =>
                i === index ? { ...fee, selected: !fee.selected } : fee
            )
        );
    };

    const handleMultipleFeeAmountChange = (index, amount) => {
        setMultipleFees(prev =>
            prev.map((fee, i) =>
                i === index ? { ...fee, amount: parseFloat(amount) || 0 } : fee
            )
        );
    };

    // Handle custom fee entry
    const handleCustomFeeChange = (field, value) => {
        setCustomFeeEntry(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddCustomFee = () => {
        if (!customFeeEntry.feeType.trim() || !customFeeEntry.amount || customFeeEntry.amount <= 0) {
            setSnackbar({
                open: true,
                message: 'Please enter fee type and valid amount',
                severity: 'warning'
            });
            return;
        }

        const newCustomFee = {
            section: customFeeEntry.section || '📝 Custom Fees',
            feeType: customFeeEntry.feeType.trim(),
            amount: parseFloat(customFeeEntry.amount),
            selected: true,
            icon: '⚡',
            isCustom: true
        };

        setMultipleFees(prev => [...prev, newCustomFee]);

        // Reset custom fee form
        setCustomFeeEntry({
            section: '',
            feeType: '',
            amount: '',
            description: ''
        });

        setSnackbar({
            open: true,
            message: 'Custom fee added successfully!',
            severity: 'success'
        });
    };

    const handleSubmitMultipleFees = async () => {
        try {
            const selectedFees = multipleFees.filter(fee => fee.selected);
            if (selectedFees.length === 0) {
                setSnackbar({ open: true, message: 'Please select at least one fee type', severity: 'warning' });
                return;
            }

            const student = students.find(s => s.id === multipleFeesStudentId);
            if (!student) {
                setSnackbar({ open: true, message: 'Student not found', severity: 'error' });
                return;
            }

            const today = new Date().toISOString().split('T')[0];

            // Process each fee individually to ensure proper backend sync
            for (const fee of selectedFees) {
                const newFee = {
                    id: Date.now() + Math.random(),
                    studentId: multipleFeesStudentId,
                    studentName: student.name,
                    section: fee.section,
                    feeType: fee.feeType,
                    amount: fee.amount,
                    dueDate: today,
                    status: 'pending',
                    description: `${fee.feeType} for ${student.name}`,
                    paidDate: null
                };

                // Add fee to local state
                setFees(prev => [...prev, newFee]);

                // Update student with each fee amount
                await updateStudentRecordFees(multipleFeesStudentId, fee.amount, 'add', fee.feeType);

                // Add small delay to prevent overwhelming the backend
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            setSnackbar({
                open: true,
                message: `${selectedFees.length} fees added successfully and synced with students!`,
                severity: 'success'
            });

            setOpenMultipleFeesDialog(false);

            // Dispatch event to notify other components
            window.dispatchEvent(new CustomEvent('feesUpdated', {
                detail: {
                    studentId: multipleFeesStudentId,
                    action: 'add_multiple',
                    feesCount: selectedFees.length
                }
            }));

            // Refresh data to ensure consistency
            setTimeout(() => {
                fetchStudents();
            }, 1500);

        } catch (error) {
            console.error('Error adding multiple fees:', error);
            setSnackbar({ open: true, message: 'Error adding multiple fees: ' + error.message, severity: 'error' });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'success';
            case 'pending': return 'warning';
            case 'overdue': return 'error';
            default: return 'default';
        }
    };

    const getTotalStats = () => {
        const total = fees.reduce((sum, fee) => sum + fee.amount, 0);
        const paid = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
        const pending = fees.filter(fee => fee.status === 'pending').reduce((sum, fee) => sum + fee.amount, 0);
        const overdue = fees.filter(fee => fee.status === 'overdue').reduce((sum, fee) => sum + fee.amount, 0);
        
        return { total, paid, pending, overdue };
    };

    const stats = getTotalStats();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
                💰 Fees Management
            </Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h6">Total Fees</Typography>
                                    <Typography variant="h4">₹{stats.total.toLocaleString()}</Typography>
                                </Box>
                                <AccountBalanceIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h6">Paid</Typography>
                                    <Typography variant="h4">₹{stats.paid.toLocaleString()}</Typography>
                                </Box>
                                <ReceiptIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h6">Pending</Typography>
                                    <Typography variant="h4">₹{stats.pending.toLocaleString()}</Typography>
                                </Box>
                                <PaymentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h6">Overdue</Typography>
                                    <Typography variant="h4">₹{stats.overdue.toLocaleString()}</Typography>
                                </Box>
                                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Actions Section */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'white' }}>
                    ⚡ Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{
                                background: 'rgba(255,255,255,0.2)',
                                '&:hover': { background: 'rgba(255,255,255,0.3)' },
                                py: 2
                            }}
                        >
                            Add Single Fee
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenStudentSelectionDialog(true)}
                            sx={{
                                background: 'rgba(255,255,255,0.2)',
                                '&:hover': { background: 'rgba(255,255,255,0.3)' },
                                py: 2
                            }}
                        >
                            Add Multiple Fees
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<CalculateIcon />}
                            onClick={() => {
                                // Force refresh all data
                                fetchStudents();
                                const savedFees = localStorage.getItem('feesManagement_fees');
                                if (savedFees) {
                                    setFees(JSON.parse(savedFees));
                                }
                                setSnackbar({ open: true, message: 'Data refreshed!', severity: 'success' });
                            }}
                            sx={{
                                background: 'rgba(255,255,255,0.2)',
                                '&:hover': { background: 'rgba(255,255,255,0.3)' },
                                py: 2
                            }}
                        >
                            Refresh Data
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<PaymentIcon />}
                            sx={{
                                background: 'rgba(255,255,255,0.2)',
                                '&:hover': { background: 'rgba(255,255,255,0.3)' },
                                py: 2
                            }}
                        >
                            Payment Reports
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Student Search Section */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
                    🔍 Student Fee Management
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        placeholder="Search by student name, section, class, or roll number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ maxWidth: 400 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                            boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                        }}
                    >
                        Add New Fee
                    </Button>
                </Box>

                {/* Student Search Results */}
                {searchQuery && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Search Results ({filteredStudents.length} students found)
                        </Typography>
                        <Grid container spacing={2}>
                            {filteredStudents.map((student) => {
                                const feeSummary = calculateStudentFeeSummary(student);
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                                        <Card 
                                            sx={{ 
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                            onClick={() => handleSelectStudent(student)}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {student.name}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Class: {student.class} | Section: {student.section}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    Roll No: {student.rollNumber}
                                                </Typography>
                                                
                                                <Divider sx={{ my: 2 }} />
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2">Total Fees:</Typography>
                                                    <Typography variant="body2" fontWeight="600">
                                                        ₹{feeSummary.totalFees.toLocaleString()}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2">Paid Fees:</Typography>
                                                    <Typography variant="body2" fontWeight="600" color="success.main">
                                                        ₹{feeSummary.paidFees.toLocaleString()}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Balance Fees:</Typography>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight="600"
                                                        color={feeSummary.balanceFees > 0 ? "error.main" : "success.main"}
                                                    >
                                                        ₹{feeSummary.balanceFees.toLocaleString()}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() => handleSelectStudent(student)}
                                                        sx={{ flex: 1 }}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleOpenMultipleFeesDialog(student)}
                                                        sx={{ flex: 1 }}
                                                    >
                                                        Add Multiple Fees
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                )}
            </Paper>

            {/* Fees Table */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Student</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Section</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Fee Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Due Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Description</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fees.map((fee) => (
                                <TableRow key={fee.id} hover>
                                    <TableCell>{fee.studentName}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={fee.section}
                                            variant="outlined"
                                            size="small"
                                            sx={{ fontSize: '0.75rem' }}
                                        />
                                    </TableCell>
                                    <TableCell>{fee.feeType}</TableCell>
                                    <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                                    <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={fee.status.toUpperCase()}
                                            color={getStatusColor(fee.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{fee.description}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(fee)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            {canDelete && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(fee.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Student Selection Dialog for Multiple Fees */}
            <Dialog open={openStudentSelectionDialog} onClose={() => setOpenStudentSelectionDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        👥 Select Student for Multiple Fees
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                        Choose a student to add multiple fees for:
                    </Typography>

                    <TextField
                        fullWidth
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        sx={{ mb: 3 }}
                    />

                    <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                        {(searchQuery ? filteredStudents : students.slice(0, 10)).map((student) => (
                            <Card
                                key={student.id}
                                sx={{
                                    mb: 2,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => {
                                    handleOpenMultipleFeesDialog(student);
                                    setOpenStudentSelectionDialog(false);
                                }}
                            >
                                <CardContent sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {student.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Class: {student.class} | Roll: {student.rollNumber}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Current Fees
                                            </Typography>
                                            <Typography variant="body2" fontWeight="600">
                                                ₹{(calculateStudentFeeSummary(student).totalFees || 0).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    {!searchQuery && students.length > 10 && (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                            Showing first 10 students. Use search to find specific students.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStudentSelectionDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Multiple Fees Dialog */}
            <Dialog open={openMultipleFeesDialog} onClose={() => setOpenMultipleFeesDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AddIcon sx={{ color: '#1976d2' }} />
                        <Typography variant="h5">
                            Add Multiple Fees - {students.find(s => s.id === multipleFeesStudentId)?.name}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                        Select the fee types you want to add. You can modify the amounts before adding.
                    </Typography>

                    {/* Custom Fee Entry Section */}
                    <Box sx={{ mb: 4, p: 3, border: '2px dashed #1976d2', borderRadius: 3, backgroundColor: 'rgba(25, 118, 210, 0.02)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                ⚡ Add Custom Fee Type
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setShowCustomFeeForm(!showCustomFeeForm)}
                                sx={{ textTransform: 'none' }}
                            >
                                {showCustomFeeForm ? 'Hide Form' : 'Add Custom Fee'}
                            </Button>
                        </Box>

                        {showCustomFeeForm && (
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Custom Fee Type Name"
                                        placeholder="e.g., Special Event Fee, Equipment Fee"
                                        value={customFeeEntry.feeType}
                                        onChange={(e) => handleCustomFeeChange('feeType', e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Amount (₹)"
                                        type="number"
                                        value={customFeeEntry.amount}
                                        onChange={(e) => handleCustomFeeChange('amount', e.target.value)}
                                        InputProps={{
                                            startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>₹</Typography>
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleAddCustomFee}
                                        disabled={!customFeeEntry.feeType.trim() || !customFeeEntry.amount}
                                        sx={{
                                            height: '56px',
                                            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
                                        }}
                                    >
                                        Add Fee
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Category (Optional)"
                                        placeholder="e.g., Special Programs, Emergency Fees"
                                        value={customFeeEntry.section}
                                        onChange={(e) => handleCustomFeeChange('section', e.target.value)}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </Box>

                    <Grid container spacing={2}>
                        {multipleFees.map((fee, index) => (
                            <Grid item xs={12} sm={6} lg={4} key={index}>
                                <Card
                                    sx={{
                                        border: fee.selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        background: fee.selected
                                            ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)'
                                            : fee.isCustom
                                                ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 193, 7, 0.1) 100%)'
                                                : 'white',
                                        '&:hover': {
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                    onClick={() => handleMultipleFeeToggle(index)}
                                >
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="h5">{fee.icon}</Typography>
                                                <Chip
                                                    label={fee.section.replace(/[🎓🚌🏢🎨🏠📋💰📝]/g, '').trim()}
                                                    size="small"
                                                    variant={fee.isCustom ? "filled" : "outlined"}
                                                    color={fee.isCustom ? "warning" : "default"}
                                                    sx={{
                                                        fontSize: '0.65rem',
                                                        height: '20px',
                                                        '& .MuiChip-label': { px: 1 }
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {fee.isCustom && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMultipleFees(prev => prev.filter((_, i) => i !== index));
                                                            setSnackbar({
                                                                open: true,
                                                                message: 'Custom fee removed',
                                                                severity: 'info'
                                                            });
                                                        }}
                                                        sx={{
                                                            color: 'error.main',
                                                            '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        border: fee.selected ? 'none' : '2px solid #ccc',
                                                        backgroundColor: fee.selected ? '#1976d2' : 'transparent',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white'
                                                    }}
                                                >
                                                    {fee.selected && '✓'}
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1.5,
                                                fontSize: '0.95rem',
                                                lineHeight: 1.3,
                                                color: fee.selected ? '#1976d2' : 'text.primary'
                                            }}
                                        >
                                            {fee.feeType}
                                        </Typography>

                                        <TextField
                                            label="Amount"
                                            type="number"
                                            value={fee.amount}
                                            onChange={(e) => handleMultipleFeeAmountChange(index, e.target.value)}
                                            size="small"
                                            fullWidth
                                            onClick={(e) => e.stopPropagation()}
                                            InputProps={{
                                                startAdornment: <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>₹</Typography>
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover fieldset': {
                                                        borderColor: '#1976d2'
                                                    }
                                                }
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box
                        sx={{
                            mt: 4,
                            p: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 3,
                            color: 'white'
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6" sx={{ opacity: 0.9, mb: 0.5 }}>
                                    Selected Fees Summary
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    {multipleFees.filter(f => f.selected).length} fee type(s) selected
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    ₹{multipleFees.filter(f => f.selected).reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Total Amount
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMultipleFeesDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmitMultipleFees}
                        variant="contained"
                        disabled={multipleFees.filter(f => f.selected).length === 0}
                        startIcon={<AddIcon />}
                    >
                        Add {multipleFees.filter(f => f.selected).length} Fees
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingFee ? 'Edit Fee' : 'Add New Fee'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Student</InputLabel>
                            <Select
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleInputChange}
                                label="Student"
                            >
                                {students.map((student) => (
                                    <MenuItem key={student.id} value={student.id}>
                                        {student.name} - {student.class} ({student.rollNumber})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Fee Section (Optional)</InputLabel>
                            <Select
                                name="section"
                                value={formData.section}
                                onChange={handleInputChange}
                                label="Fee Section (Optional)"
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>None - I'll use custom fee type</em>
                                </MenuItem>
                                {Object.keys(feeStructure).map((section) => (
                                    <MenuItem key={section} value={section}>
                                        {section}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Fee Type</InputLabel>
                            <Select
                                name="feeType"
                                value={formData.feeType}
                                onChange={handleInputChange}
                                label="Fee Type"
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>None - I'll enter custom fee type below</em>
                                </MenuItem>
                                {formData.section ? (
                                    // Show fee types for selected section
                                    Object.keys(feeStructure[formData.section] || {}).map((feeType) => (
                                        <MenuItem key={feeType} value={feeType}>
                                            {feeType}
                                        </MenuItem>
                                    ))
                                ) : (
                                    // Show all fee types from all sections if no section selected
                                    Object.values(feeStructure).flatMap(section =>
                                        Object.keys(section)
                                    ).filter((feeType, index, arr) => arr.indexOf(feeType) === index) // Remove duplicates
                                    .map((feeType) => (
                                        <MenuItem key={feeType} value={feeType}>
                                            {feeType}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        <TextField
                            name="customFeeType"
                            label="Custom Fee Type"
                            value={formData.customFeeType}
                            onChange={handleInputChange}
                            fullWidth
                            placeholder="Enter your own fee type name"
                            helperText={formData.feeType ? "Custom type not needed - you selected a predefined type above" : "Enter a custom fee type name (e.g., 'Special Event Fee', 'Equipment Fee', 'Emergency Fund', etc.)"}
                            disabled={!!formData.feeType}
                        />

                        {/* Quick custom fee templates */}
                        {!formData.feeType && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                    Quick Templates:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {[
                                        'Emergency Fund',
                                        'Special Event Fee',
                                        'Equipment Deposit',
                                        'Late Submission Fee',
                                        'Study Material Fee',
                                        'Project Work Fee',
                                        'Certificate Fee'
                                    ].map((template) => (
                                        <Chip
                                            key={template}
                                            label={template}
                                            size="small"
                                            onClick={() => setFormData(prev => ({ ...prev, customFeeType: template }))}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Fee Amount Options */}
                        {formData.section && formData.feeType && feeStructure[formData.section]?.[formData.feeType] && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                                    Available Amount Options:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {Object.entries(feeStructure[formData.section][formData.feeType]).map(([period, amount]) => (
                                        <Chip
                                            key={period}
                                            label={`${period}: ₹${amount.toLocaleString()}`}
                                            variant={formData.amount == amount ? "filled" : "outlined"}
                                            color={formData.amount == amount ? "primary" : "default"}
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    amount: amount,
                                                    description: `${formData.feeType} - ${period}`
                                                }));
                                            }}
                                            sx={{ cursor: 'pointer' }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <TextField
                            name="amount"
                            label="Amount (₹)"
                            type="number"
                            value={formData.amount}
                            onChange={handleInputChange}
                            fullWidth
                        />

                        <TextField
                            name="dueDate"
                            label="Due Date"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                label="Status"
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="overdue">Overdue</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            name="description"
                            label="Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={
                            !formData.studentId ||
                            !formData.amount ||
                            (!formData.feeType && !formData.customFeeType?.trim())
                        }
                    >
                        {editingFee ? 'Update' : 'Add'} Fee
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Student Detail Dialog */}
            <Dialog open={openStudentDialog} onClose={() => setOpenStudentDialog(false)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PersonIcon sx={{ color: '#1976d2' }} />
                            <Typography variant="h5">
                                {selectedStudent?.name} - Fee Management
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<SendIcon />}
                            onClick={handleSendMessage}
                            sx={{
                                background: 'linear-gradient(45deg, #ff6b6b 30%, #ee5a24 90%)',
                                '&:hover': { background: 'linear-gradient(45deg, #ee5a24 30%, #ff6b6b 90%)' }
                            }}
                        >
                            Send Alert
                        </Button>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Box sx={{ mt: 2 }}>
                            {/* Student Info */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                        <Typography variant="h6" gutterBottom>Student Information</Typography>
                                        <Typography>Class: {selectedStudent.class}</Typography>
                                        <Typography>Section: {selectedStudent.section}</Typography>
                                        <Typography>Roll Number: {selectedStudent.rollNumber}</Typography>
                                        <Typography>Phone: {selectedStudent.phone}</Typography>
                                        <Typography>Email: {selectedStudent.email}</Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card sx={{ p: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalculateIcon /> Fee Summary
                                        </Typography>
                                        {(() => {
                                            const summary = calculateStudentFeeSummary(selectedStudent);
                                            return (
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography>Total Fees:</Typography>
                                                        <Typography fontWeight="600">₹{summary.totalFees.toLocaleString()}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography>Paid Fees:</Typography>
                                                        <Typography fontWeight="600" color="success.main">₹{summary.paidFees.toLocaleString()}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography>Advance Fees:</Typography>
                                                        <Typography fontWeight="600" color="info.main">₹{summary.advanceFees.toLocaleString()}</Typography>
                                                    </Box>
                                                    <Divider sx={{ my: 1 }} />
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography fontWeight="600">Remaining Fees:</Typography>
                                                        <Typography 
                                                            fontWeight="600" 
                                                            color={summary.remainingFees > 0 ? "error.main" : "success.main"}
                                                        >
                                                            ₹{summary.remainingFees.toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        })()}
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Student Fees Table */}
                            <Typography variant="h6" gutterBottom>Fee Details</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fee Section</TableCell>
                                            <TableCell>Fee Type</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Due Date</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {calculateStudentFeeSummary(selectedStudent).studentFees.map((fee) => (
                                            <TableRow key={fee.id}>
                                                <TableCell>
                                                    <Chip label={fee.section} variant="outlined" size="small" />
                                                </TableCell>
                                                <TableCell>{fee.feeType}</TableCell>
                                                <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                                                <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={fee.status.toUpperCase()}
                                                        color={getStatusColor(fee.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDialog(fee)}
                                                            color="primary"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStudentDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Message Dialog */}
            <Dialog open={openMessageDialog} onClose={() => setOpenMessageDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationsIcon sx={{ color: '#ff6b6b' }} />
                        Send Alert Message
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Recipient"
                            value={messageData.recipient}
                            onChange={(e) => setMessageData(prev => ({ ...prev, recipient: e.target.value }))}
                            disabled
                        />
                        <FormControl fullWidth>
                            <InputLabel>Message Type</InputLabel>
                            <Select
                                value={messageData.type}
                                onChange={(e) => setMessageData(prev => ({ ...prev, type: e.target.value }))}
                                label="Message Type"
                            >
                                <MenuItem value="fee_reminder">Fee Reminder</MenuItem>
                                <MenuItem value="overdue_notice">Overdue Notice</MenuItem>
                                <MenuItem value="payment_confirmation">Payment Confirmation</MenuItem>
                                <MenuItem value="general_notice">General Notice</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Subject"
                            value={messageData.subject}
                            onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                        />
                        <TextField
                            fullWidth
                            label="Message"
                            multiline
                            rows={6}
                            value={messageData.message}
                            onChange={(e) => setMessageData(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Enter your message here..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenMessageDialog(false)}>Cancel</Button>
                    <Button 
                        onClick={handleMessageSubmit} 
                        variant="contained"
                        startIcon={<SendIcon />}
                        sx={{
                            background: 'linear-gradient(45deg, #ff6b6b 30%, #ee5a24 90%)',
                            '&:hover': { background: 'linear-gradient(45deg, #ee5a24 30%, #ff6b6b 90%)' }
                        }}
                    >
                        Send Message
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Debug Information Section */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', background: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                    🔧 System Status & Current Data
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                            <Typography variant="h4" color="primary" fontWeight="600">
                                {fees.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Fees in Memory
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                            <Typography variant="h4" color="success.main" fontWeight="600">
                                {students.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Students Loaded
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                            <Typography variant="h4" color="warning.main" fontWeight="600">
                                {(() => {
                                    const savedFees = localStorage.getItem('feesManagement_fees');
                                    return savedFees ? JSON.parse(savedFees).length : 0;
                                })()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Fees in Storage
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                            <Typography variant="h4" color="info.main" fontWeight="600">
                                {fees.filter(fee => fee.status === 'paid').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Paid Fees
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Current Fees List */}
                {fees.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            📋 Recently Added Fees:
                        </Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Student</TableCell>
                                        <TableCell>Fee Type</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fees.slice(-10).map((fee) => (
                                        <TableRow key={fee.id}>
                                            <TableCell>{fee.studentName}</TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="500">
                                                        {fee.feeType}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {fee.section?.replace(/[🎓🚌🏢🎨🏠📋💰📝]/g, '').trim()}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>₹{fee.amount?.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    label={fee.status}
                                                    color={fee.status === 'paid' ? 'success' : 'warning'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    {canDelete && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDelete(fee.id)}
                                                            color="error"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {fees.length === 0 && (
                    <Box sx={{ mt: 3, textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            No fees added yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Use the "Add Multiple Fees" button above to start adding fees for students
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setOpenStudentSelectionDialog(true)}
                            sx={{
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)'
                                }
                            }}
                        >
                            Add Your First Fees
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* All Fees List Section */}
            {fees.length > 0 && (
                <Paper sx={{ p: 3, mb: 4, borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
                        📋 All Fees Records ({fees.length})
                    </Typography>

                    {/* Fees by Category */}
                    {(() => {
                        // Group fees by section
                        const groupedFees = fees.reduce((acc, fee) => {
                            const section = fee.section || 'Other Fees';
                            if (!acc[section]) {
                                acc[section] = [];
                            }
                            acc[section].push(fee);
                            return acc;
                        }, {});

                        return Object.entries(groupedFees).map(([section, sectionFees]) => {
                            const sectionTotal = sectionFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
                            const sectionPaid = sectionFees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + (fee.amount || 0), 0);

                            return (
                                <Card key={section} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
                                    {/* Section Header */}
                                    <Box sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        p: 2
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {section.replace(/[🎓🚌🏢🎨🏠📋💰📝]/g, '').trim() || 'Other Fees'}
                                            </Typography>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                    ₹{sectionTotal.toLocaleString()}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                                    {sectionFees.length} fee(s) | {sectionFees.filter(f => f.status === 'paid').length} paid
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Section Fees Table */}
                                    <CardContent sx={{ p: 0 }}>
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                                        <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                                                        <TableCell sx={{ fontWeight: 600 }}>Fee Type</TableCell>
                                                        <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                                        <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {sectionFees.map((fee) => (
                                                        <TableRow key={fee.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                                            <TableCell>
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight="500">
                                                                        {fee.studentName}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        ID: {fee.studentId}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" fontWeight="500">
                                                                    {fee.feeType}
                                                                </Typography>
                                                                {fee.description && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {fee.description}
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" fontWeight="600" color="primary">
                                                                    ₹{fee.amount?.toLocaleString()}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    size="small"
                                                                    label={fee.status}
                                                                    color={fee.status === 'paid' ? 'success' : fee.status === 'pending' ? 'warning' : 'error'}
                                                                    sx={{ minWidth: 60 }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'Not set'}
                                                                </Typography>
                                                                {fee.paidDate && (
                                                                    <Typography variant="caption" color="success.main">
                                                                        Paid: {new Date(fee.paidDate).toLocaleDateString()}
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                    <Tooltip title="Edit Fee">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="primary"
                                                                            onClick={() => {
                                                                                const student = students.find(s => s.id === fee.studentId);
                                                                                if (student) {
                                                                                    setSelectedStudent(student);
                                                                                    handleOpenDialog(fee);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    {canDelete && (
                                                                        <Tooltip title="Delete Fee">
                                                                            <IconButton
                                                                                size="small"
                                                                                color="error"
                                                                                onClick={() => handleDelete(fee.id)}
                                                                            >
                                                                                <DeleteIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )}
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            );
                        });
                    })()}
                </Paper>
            )}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FeesManagement;
