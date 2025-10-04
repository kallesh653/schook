import React, { useState, useEffect } from 'react';
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
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Tooltip,
  Avatar,
  Fade,
  Zoom,
  Slide
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GetApp as DownloadIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Payment as PaymentIcon,
  FileDownload as ExcelIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../environment';
import { useDashboard } from '../../../context/DashboardContext';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
  },
  animation: `${fadeInUp} 0.6s ease-out`
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
  },
  transition: 'all 0.3s ease'
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  border: '1px solid rgba(255,255,255,0.2)',
  '& .MuiTableHead-root': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '& .MuiTableCell-head': {
      color: 'white',
      fontWeight: 600,
      fontSize: '0.95rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(102, 126, 234, 0.05)',
      transform: 'scale(1.01)'
    }
  }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3
  }
}));

const StudentRecords = () => {
  const { triggerDashboardRefresh } = useDashboard();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalFeesCollected: 0,
    totalFeesBalance: 0
  });

  const [studentNameExists, setStudentNameExists] = useState(null);
  const [isCheckingName, setIsCheckingName] = useState(false);

  const [formData, setFormData] = useState({
    student_name: '',
    father_name: '',
    mother_name: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    religion: '',
    caste: '',
    nationality: 'Indian',
    class: '',
    section: '',
    roll_number: '',
    school_name: '',
    school_id: '',
    established_year: '',
    admission_number: '',
    academic_year: new Date().getFullYear().toString(),
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    phone_number: '',
    email: '',
    emergency_contact: {
      name: '',
      relationship: '',
      phone: ''
    },
    fees: {
      total_fees: 0,
      paid_fees: 0,
      balance_fees: 0,
      transport_fees: 0
    },
    previous_school: '',
    medical_conditions: '',
    transport_required: false,
    hostel_required: false,
    status: 'Active'
  });

  const fetchData = async () => {
    try {
      console.log('=== FETCHING DATA ===');
      console.log('Base URL:', baseUrl);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('Token:', token ? 'Present' : 'Not found');

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log('Headers:', headers);

      const [recordsRes, statsRes] = await Promise.all([
        axios.get(`${baseUrl}/student-records`, { headers }),
        axios.get(`${baseUrl}/student-records/stats`, { headers })
      ]);

      console.log('Records response:', recordsRes.data);
      console.log('Stats response:', statsRes.data);

      setRecords(recordsRes.data.data || []);
      setStats(statsRes.data.data || {});
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      console.error('Error response:', error.response?.data);
      setSnackbar({ open: true, message: 'Error fetching data: ' + (error.response?.data?.message || error.message), severity: 'error' });
    }
  };

  // Function to check if student name exists in Students database
  const checkStudentNameExists = async (studentName) => {
    if (!studentName.trim()) {
      setStudentNameExists(null);
      return;
    }

    setIsCheckingName(true);
    try {
      const response = await axios.get(`${baseUrl}/student/fetch-with-query`, {
        params: { search: studentName.trim() }
      });

      const students = response.data.data || [];
      const exactMatch = students.find(student =>
        student.name.toLowerCase() === studentName.trim().toLowerCase()
      );

      setStudentNameExists(!!exactMatch);
    } catch (error) {
      console.error('Error checking student name:', error);
      setStudentNameExists(null);
    } finally {
      setIsCheckingName(false);
    }
  };

  // Load fees data from localStorage
  const loadFeesData = () => {
    try {
      const savedFees = localStorage.getItem('feesManagement_fees');
      if (savedFees) {
        const feesArray = JSON.parse(savedFees);
        setFeesData(feesArray);
        return feesArray;
      }
      return [];
    } catch (error) {
      console.error('Error loading fees data:', error);
      return [];
    }
  };

  // Update fees information for records
  const updateRecordsWithFees = () => {
    const latestFeesData = loadFeesData();
    setRecords(prevRecords =>
      prevRecords.map(record => {
        const studentFees = latestFeesData.filter(fee => fee.studentId === record._id);

        if (studentFees.length === 0) {
          return record;
        }

        const totalFees = studentFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
        const paidFees = studentFees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + (fee.amount || 0), 0);
        const balanceFees = totalFees - paidFees;

        // Calculate transport fees specifically
        const transportFees = studentFees
          .filter(fee =>
            fee.feeType && (
              fee.feeType.toLowerCase().includes('transport') ||
              fee.feeType.toLowerCase().includes('bus') ||
              fee.section && fee.section.toLowerCase().includes('transport')
            )
          )
          .reduce((sum, fee) => sum + (fee.amount || 0), 0);

        return {
          ...record,
          fees: {
            total_fees: totalFees,
            paid_fees: paidFees,
            balance_fees: balanceFees,
            transport_fees: transportFees
          }
        };
      })
    );
  };

  useEffect(() => {
    fetchData();
    loadFeesData();
  }, []);

  // Listen for fees updates
  useEffect(() => {
    const handleFeesUpdate = () => {
      updateRecordsWithFees();
    };

    // Listen for custom events from fees management
    window.addEventListener('feesUpdated', handleFeesUpdate);

    // Also listen for localStorage changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'feesManagement_fees') {
        updateRecordsWithFees();
      }
    });

    return () => {
      window.removeEventListener('feesUpdated', handleFeesUpdate);
      window.removeEventListener('storage', handleFeesUpdate);
    };
  }, []);

  // Sync transport fees with fees management system
  const syncTransportFeesToFeesManagement = async (studentId, studentName, newTransportFees, oldTransportFees = 0) => {
    try {
      const savedFees = localStorage.getItem('feesManagement_fees');
      let allFees = savedFees ? JSON.parse(savedFees) : [];

      // Remove existing transport fees for this student
      allFees = allFees.filter(fee => !(
        fee.studentId === studentId &&
        fee.feeType && (
          fee.feeType.toLowerCase().includes('transport') ||
          fee.feeType.toLowerCase().includes('bus')
        )
      ));

      // Add new transport fee if amount > 0
      if (newTransportFees > 0) {
        const newTransportFee = {
          id: Date.now() + Math.random(),
          studentId: studentId,
          studentName: studentName,
          section: '🚌 Transportation Services',
          feeType: 'Bus Transportation',
          amount: newTransportFees,
          dueDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          description: `Transport fees for ${studentName}`,
          paidDate: null
        };

        allFees.push(newTransportFee);
      }

      // Save back to localStorage
      localStorage.setItem('feesManagement_fees', JSON.stringify(allFees));

      // Dispatch event to notify fees management component
      window.dispatchEvent(new CustomEvent('feesUpdated', {
        detail: {
          studentId: studentId,
          action: 'transport_fees_sync',
          amount: newTransportFees
        }
      }));

      console.log('Transport fees synced to fees management system');
    } catch (error) {
      console.error('Error syncing transport fees:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('=== SUBMITTING STUDENT RECORD ===');
      console.log('Dialog mode:', dialogMode);
      console.log('Form data:', formData);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log('Headers:', headers);

      if (!formData.student_name || formData.student_name.trim() === '') {
        setSnackbar({ open: true, message: 'Please enter student name', severity: 'error' });
        return;
      }

      // Check if student name exists in Students section (only for create mode)
      if (dialogMode === 'create' && studentNameExists !== true) {
        setSnackbar({
          open: true,
          message: 'Please verify the student name exists in the Students section before proceeding.',
          severity: 'error'
        });
        return;
      }

      const cleanedData = { ...formData };

      // Convert established year
      if (cleanedData.established_year) {
        cleanedData.established_year = parseInt(cleanedData.established_year);
      }

      // Clean fees
      Object.keys(cleanedData.fees).forEach(key => {
        cleanedData.fees[key] = parseFloat(cleanedData.fees[key]) || 0;
      });

      // Store old transport fees for comparison
      const oldTransportFees = dialogMode === 'edit' ? (selectedRecord?.fees?.transport_fees || 0) : 0;

      // Ensure transport fees are included in total fees
      const transportFees = cleanedData.fees.transport_fees || 0;
      const otherFees = cleanedData.fees.total_fees - (formData.fees.transport_fees || 0); // Remove old transport fees from total
      cleanedData.fees.total_fees = otherFees + transportFees; // Add current transport fees

      // Calculate balance fees
      cleanedData.fees.balance_fees = cleanedData.fees.total_fees - cleanedData.fees.paid_fees;

      console.log('Cleaned data to submit:', cleanedData);

      if (dialogMode === 'edit') {
        console.log('Updating record:', selectedRecord._id);
        const response = await axios.put(`${baseUrl}/student-records/${selectedRecord._id}`, cleanedData, { headers });
        console.log('Update response:', response.data);

        // Sync transport fees to fees management system
        await syncTransportFeesToFeesManagement(
          selectedRecord._id,
          cleanedData.student_name,
          transportFees,
          oldTransportFees
        );

        setSnackbar({ open: true, message: 'Student record updated and transport fees synced!', severity: 'success' });
      } else {
        console.log('Creating new record...');
        const response = await axios.post(`${baseUrl}/student-records`, cleanedData, { headers });
        console.log('✅ Create response:', response.data);

        // Sync transport fees to fees management system for new record
        if (response.data.data && transportFees > 0) {
          await syncTransportFeesToFeesManagement(
            response.data.data._id,
            cleanedData.student_name,
            transportFees,
            0
          );
        }

        setSnackbar({ open: true, message: 'Student record created and transport fees synced!', severity: 'success' });
      }

      fetchData();
      handleCloseDialog();

      // Trigger dashboard refresh since fees data has changed
      triggerDashboardRefresh('Student record fees updated');
    } catch (error) {
      console.error('❌ Error saving student record:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error saving student record';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        await axios.delete(`${baseUrl}/student-records/${id}`, { headers });
        setSnackbar({ open: true, message: 'Student record deleted successfully!', severity: 'success' });
        fetchData();

        // Trigger dashboard refresh since fees data has changed
        triggerDashboardRefresh('Student record deleted');
      } catch (error) {
        console.error('Error deleting record:', error);
        setSnackbar({ open: true, message: 'Error deleting record', severity: 'error' });
      }
    }
  };

  const handleOpenDialog = (mode, record = null) => {
    setDialogMode(mode);
    // Reset validation state
    setStudentNameExists(null);
    setIsCheckingName(false);

    if (record) {
      setSelectedRecord(record);
      setFormData({
        ...record,
        date_of_birth: record.date_of_birth ? new Date(record.date_of_birth).toISOString().split('T')[0] : '',
        fees: record.fees || formData.fees
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      student_name: '',
      father_name: '',
      mother_name: '',
      date_of_birth: '',
      gender: '',
      blood_group: '',
      religion: '',
      caste: '',
      nationality: 'Indian',
      class: '',
      section: '',
      roll_number: '',
      admission_number: '',
      academic_year: new Date().getFullYear().toString(),
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
      },
      phone_number: '',
      email: '',
      emergency_contact: {
        name: '',
        relationship: '',
        phone: ''
      },
      fees: {
        total_fees: 0,
        paid_fees: 0,
        balance_fees: 0,
        transport_fees: 0
      },
      previous_school: '',
      medical_conditions: '',
      transport_required: false,
      hostel_required: false,
      status: 'Active',
      school_name: '',
      school_id: '',
      established_year: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    console.log('Input change:', { name, value, type, checked });

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const newData = {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        };

        // Auto-calculate total fees and balance fees when any fees change
        if (parent === 'fees') {
          const transportFees = parseFloat(child === 'transport_fees' ? value : newData.fees.transport_fees) || 0;
          const paidFees = parseFloat(child === 'paid_fees' ? value : newData.fees.paid_fees) || 0;

          // If transport fees changed, update total fees automatically
          if (child === 'transport_fees') {
            // Get base total fees (total minus current transport fees)
            const baseTotalFees = (parseFloat(newData.fees.total_fees) || 0) - (parseFloat(prev.fees.transport_fees) || 0);
            newData.fees.total_fees = baseTotalFees + transportFees;
          }

          // If total fees or paid fees changed, calculate balance
          if (child === 'total_fees' || child === 'paid_fees' || child === 'transport_fees') {
            const totalFees = parseFloat(child === 'total_fees' ? value : newData.fees.total_fees) || 0;
            newData.fees.balance_fees = totalFees - paidFees;
          }
        }

        console.log('Updated formData (nested):', newData);
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        };
        console.log('Updated formData (direct):', newData);
        return newData;
      });

      // Check if student name exists when student_name changes (only in create mode)
      if (name === 'student_name' && dialogMode === 'create') {
        checkStudentNameExists(value);
      }
    }
  };

  const handleDownloadPDF = async (id, studentName) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${baseUrl}/student-records/${id}/pdf`, { headers });

      if (response.data.success) {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(response.data.data.htmlContent);
        printWindow.document.close();

        // Wait for content to load before printing
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            printWindow.onafterprint = () => printWindow.close();
          }, 1000);
        };

        setSnackbar({ open: true, message: `PDF generated for ${studentName}`, severity: 'success' });
      } else {
        throw new Error(response.data.message || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      const errorMessage = error.response?.data?.message || 'Error downloading PDF';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'Transferred': return 'warning';
      case 'Graduated': return 'info';
      default: return 'default';
    }
  };

  // Excel Export Functions
  const exportToExcel = () => {
    try {
      const exportData = records.map((record, index) => ({
        'S.No': index + 1,
        'Student Name': record.student_name || 'N/A',
        'Father Name': record.father_name || 'N/A',
        'Mother Name': record.mother_name || 'N/A',
        'Date of Birth': record.date_of_birth || 'N/A',
        'Gender': record.gender || 'N/A',
        'Phone': record.phone || 'N/A',
        'Email': record.email || 'N/A',
        'Address': record.address || 'N/A',
        'School': record.school || 'N/A',
        'Section': record.section || 'N/A',
        'Previous School': record.previous_school || 'N/A',
        'Admission Date': record.admission_date || 'N/A',
        'Established Year': record.established_year || 'N/A',
        'Status': record.status || 'N/A',
        'Total Fees': record.fees?.total_fees || 0,
        'Paid Fees': record.fees?.paid_fees || 0,
        'Balance Fees': record.fees?.balance_fees || 0,
        'Transport Fees': record.fees?.transport_fees || 0,
        'Hostel Fees': record.fees?.hostel_fees || 0,
        'Library Fees': record.fees?.library_fees || 0,
        'Lab Fees': record.fees?.lab_fees || 0,
        'Sports Fees': record.fees?.sports_fees || 0,
        'Other Fees': record.fees?.other_fees || 0
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();

      // Set column widths
      const columnWidths = [
        { wch: 8 },   // S.No
        { wch: 20 },  // Student Name
        { wch: 20 },  // Father Name
        { wch: 20 },  // Mother Name
        { wch: 15 },  // Date of Birth
        { wch: 10 },  // Gender
        { wch: 15 },  // Phone
        { wch: 25 },  // Email
        { wch: 30 },  // Address
        { wch: 20 },  // School
        { wch: 15 },  // Section
        { wch: 20 },  // Previous School
        { wch: 15 },  // Admission Date
        { wch: 15 },  // Established Year
        { wch: 12 },  // Status
        { wch: 12 },  // Total Fees
        { wch: 12 },  // Paid Fees
        { wch: 12 },  // Balance Fees
        { wch: 15 },  // Transport Fees
        { wch: 12 },  // Hostel Fees
        { wch: 12 },  // Library Fees
        { wch: 12 },  // Lab Fees
        { wch: 12 },  // Sports Fees
        { wch: 12 }   // Other Fees
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Records');

      const fileName = `Student_Records_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      setSnackbar({
        open: true,
        message: `Excel file exported successfully: ${fileName}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      setSnackbar({
        open: true,
        message: 'Error exporting to Excel',
        severity: 'error'
      });
    }
  };

  const exportToExcelFiltered = (filterCriteria = {}) => {
    try {
      let filteredRecords = records;

      // Apply filters
      if (filterCriteria.status) {
        filteredRecords = filteredRecords.filter(record =>
          record.status === filterCriteria.status
        );
      }

      if (filterCriteria.gender) {
        filteredRecords = filteredRecords.filter(record =>
          record.gender === filterCriteria.gender
        );
      }

      if (filterCriteria.feesStatus) {
        if (filterCriteria.feesStatus === 'Paid') {
          filteredRecords = filteredRecords.filter(record =>
            (record.fees?.balance_fees || 0) === 0
          );
        } else if (filterCriteria.feesStatus === 'Pending') {
          filteredRecords = filteredRecords.filter(record =>
            (record.fees?.balance_fees || 0) > 0
          );
        }
      }

      const exportData = filteredRecords.map((record, index) => ({
        'S.No': index + 1,
        'Student Name': record.student_name || 'N/A',
        'Father Name': record.father_name || 'N/A',
        'Mother Name': record.mother_name || 'N/A',
        'Date of Birth': record.date_of_birth || 'N/A',
        'Gender': record.gender || 'N/A',
        'Phone': record.phone || 'N/A',
        'Email': record.email || 'N/A',
        'Address': record.address || 'N/A',
        'School': record.school || 'N/A',
        'Section': record.section || 'N/A',
        'Previous School': record.previous_school || 'N/A',
        'Admission Date': record.admission_date || 'N/A',
        'Established Year': record.established_year || 'N/A',
        'Status': record.status || 'N/A',
        'Total Fees': record.fees?.total_fees || 0,
        'Paid Fees': record.fees?.paid_fees || 0,
        'Balance Fees': record.fees?.balance_fees || 0,
        'Transport Fees': record.fees?.transport_fees || 0,
        'Hostel Fees': record.fees?.hostel_fees || 0,
        'Library Fees': record.fees?.library_fees || 0,
        'Lab Fees': record.fees?.lab_fees || 0,
        'Sports Fees': record.fees?.sports_fees || 0,
        'Other Fees': record.fees?.other_fees || 0
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();

      // Set column widths
      const columnWidths = [
        { wch: 8 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 },
        { wch: 10 }, { wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 20 },
        { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
        { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 12 },
        { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }
      ];
      worksheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Student Records');

      const filterString = Object.entries(filterCriteria)
        .filter(([key, value]) => value)
        .map(([key, value]) => `${key}_${value}`)
        .join('_');

      const fileName = `Student_Records_${filterString || 'All'}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      setSnackbar({
        open: true,
        message: `Filtered Excel file exported: ${fileName}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting filtered Excel:', error);
      setSnackbar({
        open: true,
        message: 'Error exporting filtered Excel',
        severity: 'error'
      });
    }
  };

  // RDLC Report Function
  const generateRDLCReport = () => {
    try {
      // Create HTML content for RDLC-style report
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Student Records Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2196F3; margin: 0; }
            .header h2 { color: #666; margin: 5px 0; }
            .meta-info { margin: 20px 0; display: flex; justify-content: space-between; }
            .report-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .report-table th, .report-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-size: 12px;
            }
            .report-table th {
              background-color: #2196F3;
              color: white;
              font-weight: bold;
            }
            .report-table tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { margin-top: 30px; }
            .summary-box {
              display: inline-block;
              margin: 10px;
              padding: 15px;
              border: 2px solid #2196F3;
              border-radius: 5px;
              text-align: center;
            }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
            @media print {
              body { margin: 0; }
              .header h1 { font-size: 18px; }
              .header h2 { font-size: 14px; }
              .report-table th, .report-table td { font-size: 10px; padding: 4px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>STUDENT RECORDS REPORT</h1>
            <h2>Academic Year ${new Date().getFullYear()}</h2>
          </div>

          <div class="meta-info">
            <div><strong>Report Generated:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Total Records:</strong> ${records.length}</div>
            <div><strong>Generated By:</strong> School Management System</div>
          </div>

          <table class="report-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student Name</th>
                <th>Father Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>School</th>
                <th>Section</th>
                <th>Status</th>
                <th>Total Fees</th>
                <th>Paid Fees</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              ${records.map((record, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${record.student_name || 'N/A'}</td>
                  <td>${record.father_name || 'N/A'}</td>
                  <td>${record.date_of_birth || 'N/A'}</td>
                  <td>${record.gender || 'N/A'}</td>
                  <td>${record.phone || 'N/A'}</td>
                  <td>${record.school || 'N/A'}</td>
                  <td>${record.section || 'N/A'}</td>
                  <td>${record.status || 'N/A'}</td>
                  <td>₹${record.fees?.total_fees || 0}</td>
                  <td>₹${record.fees?.paid_fees || 0}</td>
                  <td>₹${record.fees?.balance_fees || 0}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <h3>Summary Statistics</h3>
            <div class="summary-box">
              <strong>${records.length}</strong><br>Total Students
            </div>
            <div class="summary-box">
              <strong>${records.filter(r => r.status === 'Active').length}</strong><br>Active Students
            </div>
            <div class="summary-box">
              <strong>₹${records.reduce((sum, r) => sum + (r.fees?.total_fees || 0), 0).toLocaleString()}</strong><br>Total Fees
            </div>
            <div class="summary-box">
              <strong>₹${records.reduce((sum, r) => sum + (r.fees?.paid_fees || 0), 0).toLocaleString()}</strong><br>Collected Fees
            </div>
            <div class="summary-box">
              <strong>₹${records.reduce((sum, r) => sum + (r.fees?.balance_fees || 0), 0).toLocaleString()}</strong><br>Pending Fees
            </div>
          </div>

          <div class="footer">
            <p>This report was generated automatically by the School Management System</p>
            <p>Report Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank', 'width=1200,height=800');
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };

      setSnackbar({
        open: true,
        message: 'RDLC Report generated and opened for printing',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating RDLC report:', error);
      setSnackbar({
        open: true,
        message: 'Error generating RDLC report',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <HeaderSection>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  background: 'rgba(255,255,255,0.2)',
                  fontSize: '2rem',
                  animation: `${pulse} 2s infinite`
                }}
              >
                👨‍🎓
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                  Student Records Management
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Comprehensive student information system
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <StyledButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('create')}
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px) scale(1.05)'
                  }
                }}
              >
                Add New Student
              </StyledButton>

              <StyledButton
                variant="contained"
                startIcon={<ExcelIcon />}
                onClick={exportToExcel}
                sx={{
                  background: 'rgba(76, 175, 80, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(76, 175, 80, 0.9)',
                    transform: 'translateY(-2px) scale(1.05)'
                  }
                }}
              >
                Export Excel
              </StyledButton>

              <StyledButton
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={generateRDLCReport}
                sx={{
                  background: 'rgba(255, 152, 0, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 152, 0, 0.9)',
                    transform: 'translateY(-2px) scale(1.05)'
                  }
                }}
              >
                RDLC Report
              </StyledButton>
            </Box>
          </Box>
        </Box>
      </HeaderSection>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in timeout={600}>
            <StyledCard sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {stats.totalStudents}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Total Students
                    </Typography>
                  </Box>
                  <Avatar sx={{
                    width: 56,
                    height: 56,
                    background: 'rgba(255,255,255,0.2)',
                    fontSize: '1.8rem'
                  }}>
                    🏫
                  </Avatar>
                </Box>
              </CardContent>
            </StyledCard>
          </Zoom>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in timeout={800}>
            <StyledCard sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      ₹{(stats.totalFeesCollected + stats.totalFeesBalance).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      Total Fees
                    </Typography>
                  </Box>
                  <Avatar sx={{
                    width: 56,
                    height: 56,
                    background: 'rgba(255,255,255,0.2)',
                    fontSize: '1.8rem'
                  }}>
                    💳
                  </Avatar>
                </Box>
              </CardContent>
            </StyledCard>
          </Zoom>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in timeout={1000}>
            <StyledCard sx={{ background: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)', color: '#2d3748' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      ₹{stats.totalFeesCollected.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8, fontWeight: 500 }}>
                      Fees Collected
                    </Typography>
                  </Box>
                  <Avatar sx={{
                    width: 56,
                    height: 56,
                    background: 'rgba(45,55,72,0.1)',
                    fontSize: '1.8rem'
                  }}>
                    💰
                  </Avatar>
                </Box>
              </CardContent>
            </StyledCard>
          </Zoom>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in timeout={1200}>
            <StyledCard sx={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: '#2d3748' }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      ₹{stats.totalFeesBalance.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8, fontWeight: 500 }}>
                      Balance Fees
                    </Typography>
                  </Box>
                  <Avatar sx={{
                    width: 56,
                    height: 56,
                    background: 'rgba(45,55,72,0.1)',
                    fontSize: '1.8rem'
                  }}>
                    📊
                  </Avatar>
                </Box>
              </CardContent>
            </StyledCard>
          </Zoom>
        </Grid>
      </Grid>

      {/* Student Records Table */}
      <Fade in timeout={1000}>
        <StyledCard>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                📚 Student Records Database
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Manage and track all student information efficiently
              </Typography>
            </Box>
            <StyledTableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Roll No.</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Parent Phone</TableCell>
                    <TableCell>Total Fees</TableCell>
                    <TableCell>Transport Fees</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((record, index) => (
                    <Slide key={record._id} direction="up" in timeout={300 + index * 100}>
                      <TableRow>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                              width: 40, 
                              height: 40, 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontSize: '1.2rem'
                            }}>
                              {record.student_name?.charAt(0)?.toUpperCase() || '👤'}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="600">
                                {record.student_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {record._id?.slice(-6)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={record.roll_number} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {record.class || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {record.section}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {record.phone_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="600" color="success.main">
                              ₹{(record.fees?.total_fees || 0).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Paid: ₹{(record.fees?.paid_fees || 0).toLocaleString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="600" color="primary.main">
                              ₹{(record.fees?.transport_fees || 0).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Transport
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              color={record.fees?.balance_fees > 0 ? "error.main" : "success.main"}
                            >
                              ₹{(record.fees?.balance_fees || 0).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {record.fees?.balance_fees > 0 ? "Pending" : "Clear"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={record.status}
                            color={getStatusColor(record.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                onClick={() => handleOpenDialog('view', record)}
                                size="small"
                                sx={{
                                  color: 'info.main',
                                  '&:hover': {
                                    background: 'rgba(33, 150, 243, 0.1)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Manage Fees">
                              <IconButton
                                onClick={() => {
                                  // Navigate to fees page with student ID in search state
                                  navigate('/school/fees', {
                                    state: {
                                      searchStudent: record.student_name,
                                      studentId: record._id
                                    }
                                  });
                                }}
                                size="small"
                                sx={{
                                  color: 'secondary.main',
                                  '&:hover': {
                                    background: 'rgba(156, 39, 176, 0.1)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <MoneyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Record">
                              <IconButton
                                onClick={() => handleOpenDialog('edit', record)}
                                size="small"
                                sx={{
                                  color: 'warning.main',
                                  '&:hover': {
                                    background: 'rgba(255, 152, 0, 0.1)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download PDF">
                              <IconButton
                                onClick={() => handleDownloadPDF(record._id, record.student_name)}
                                size="small"
                                sx={{
                                  color: 'success.main',
                                  '&:hover': {
                                    background: 'rgba(76, 175, 80, 0.1)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Record">
                              <IconButton
                                onClick={() => handleDelete(record._id)}
                                size="small"
                                sx={{
                                  color: 'error.main',
                                  '&:hover': {
                                    background: 'rgba(244, 67, 54, 0.1)',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </Slide>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </CardContent>
        </StyledCard>
      </Fade>

      {/* Dialog for Create/Edit/View */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && 'Add New Student Record'}
          {dialogMode === 'edit' && 'Edit Student Record'}
          {dialogMode === 'view' && 'View Student Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Step 1: Student Name Validation */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {dialogMode === 'create' ? 'Step 1: Verify Student' : 'Personal Information'}
              </Typography>
              {dialogMode === 'create' && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  First, enter the student name to check if they exist in the Students section
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student Name"
                name="student_name"
                value={formData.student_name}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                required
                error={dialogMode === 'create' && studentNameExists === false}
                helperText={
                  dialogMode === 'create' && formData.student_name.trim() ? (
                    isCheckingName ? (
                      '🔍 Checking if student exists in Students section...'
                    ) : studentNameExists === true ? (
                      '✅ Student found! You can now proceed to fill the rest of the form below.'
                    ) : studentNameExists === false ? (
                      '❌ Student not found in Students section. Please add the student there first, then come back here.'
                    ) : null
                  ) : dialogMode === 'create' ? (
                    'Enter the exact student name as it appears in the Students section'
                  ) : null
                }
              />
            </Grid>

            {/* Show rest of form only if name validation passes OR in view/edit mode */}
            {(dialogMode !== 'create' || studentNameExists === true) && (
              <>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {dialogMode === 'create' ? 'Step 2: Complete Student Record' : 'Personal Information'}
                  </Typography>
                </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father's Name"
                name="father_name"
                value={formData.father_name}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mother's Name"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={dialogMode === 'view'}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Blood Group"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>

            {/* School Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>School Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="School Name"
                name="school_name"
                value={formData.school_name}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                placeholder="Enter school name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="School ID"
                name="school_id"
                value={formData.school_id}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                placeholder="Enter school ID"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Established Year"
                name="established_year"
                type="number"
                value={formData.established_year}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                placeholder="e.g., 2000"
              />
            </Grid>

            {/* Academic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Academic Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Class"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                placeholder="e.g., 10th, 12th, Class 5"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Roll Number"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Academic Year"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Contact Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>

            {/* Fees Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>💰 Fees Information</Typography>
            </Grid>

            {dialogMode === 'view' ? (
              // Enhanced view mode for fees
              <Grid item xs={12}>
                <Card sx={{ p: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2, color: '#1976d2' }}>
                    Detailed Fees Breakdown
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                        <Typography variant="h4" color="primary" fontWeight="600">
                          ₹{(formData.fees.total_fees || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Fees
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                        <Typography variant="h4" color="success.main" fontWeight="600">
                          ₹{(formData.fees.paid_fees || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Paid Amount
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                        <Typography
                          variant="h4"
                          color={formData.fees.balance_fees > 0 ? "error.main" : "success.main"}
                          fontWeight="600"
                        >
                          ₹{(formData.fees.balance_fees || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formData.fees.balance_fees > 0 ? "Outstanding" : "Balance"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Comprehensive Fees Section */}
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
                      💰 Complete Fees Management
                    </Typography>

                    {(() => {
                      const savedFees = localStorage.getItem('feesManagement_fees');
                      const allFees = savedFees ? JSON.parse(savedFees) : [];
                      const studentFees = allFees.filter(fee => fee.studentId === selectedRecord?._id);

                      // Group fees by category/section
                      const groupedFees = studentFees.reduce((acc, fee) => {
                        const section = fee.section || 'Other Fees';
                        if (!acc[section]) {
                          acc[section] = [];
                        }
                        acc[section].push(fee);
                        return acc;
                      }, {});

                      if (studentFees.length === 0) {
                        return (
                          <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              📝 No Fee Records Found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                              This student doesn't have any detailed fee records yet.
                              <br />
                              Use the buttons below to start managing their fees.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  navigate('/school/fees', {
                                    state: {
                                      searchStudent: formData.student_name,
                                      studentId: selectedRecord?._id
                                    }
                                  });
                                }}
                                sx={{
                                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                  '&:hover': {
                                    background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)'
                                  }
                                }}
                              >
                                Add Fees
                              </Button>
                              <Button variant="outlined">
                                Import from Template
                              </Button>
                            </Box>
                          </Card>
                        );
                      }

                      return (
                        <Box>
                          {/* Fees Summary Cards by Category */}
                          {Object.entries(groupedFees).map(([section, fees]) => {
                            const sectionTotal = fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
                            const sectionPaid = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + (fee.amount || 0), 0);
                            const sectionPending = sectionTotal - sectionPaid;

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
                                        {fees.length} fee(s)
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                                    <Box>
                                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Paid</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        ₹{sectionPaid.toLocaleString()}
                                      </Typography>
                                    </Box>
                                    <Box>
                                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Pending</Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        ₹{sectionPending.toLocaleString()}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>

                                {/* Section Fees Details */}
                                <CardContent sx={{ p: 0 }}>
                                  <TableContainer>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                          <TableCell sx={{ fontWeight: 600 }}>Fee Type</TableCell>
                                          <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                          <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {fees.map((fee, index) => (
                                          <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
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
                                            </TableCell>
                                            <TableCell>
                                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                {fee.status !== 'paid' && (
                                                  <Tooltip title="Mark as Paid">
                                                    <IconButton
                                                      size="small"
                                                      color="success"
                                                      onClick={() => {
                                                        // Update fee status in localStorage
                                                        const allFeesArray = JSON.parse(localStorage.getItem('feesManagement_fees') || '[]');
                                                        const updatedFees = allFeesArray.map(f =>
                                                          f.id === fee.id ? { ...f, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : f
                                                        );
                                                        localStorage.setItem('feesManagement_fees', JSON.stringify(updatedFees));

                                                        // Refresh the dialog
                                                        updateRecordsWithFees();
                                                        setSnackbar({ open: true, message: 'Fee marked as paid!', severity: 'success' });
                                                      }}
                                                    >
                                                      <PaymentIcon fontSize="small" />
                                                    </IconButton>
                                                  </Tooltip>
                                                )}
                                                <Tooltip title="Edit Fee">
                                                  <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {
                                                      navigate('/school/fees', {
                                                        state: {
                                                          searchStudent: formData.student_name,
                                                          studentId: selectedRecord?._id,
                                                          editFeeId: fee.id
                                                        }
                                                      });
                                                    }}
                                                  >
                                                    <EditIcon fontSize="small" />
                                                  </IconButton>
                                                </Tooltip>
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
                          })}

                          {/* Fee Payment History */}
                          <Card sx={{ mt: 3, borderRadius: 3 }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                                📈 Payment History
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                {studentFees.filter(fee => fee.status === 'paid' && fee.paidDate).map((fee, index) => (
                                  <Chip
                                    key={index}
                                    label={`${fee.feeType} - ₹${fee.amount?.toLocaleString()} (${new Date(fee.paidDate).toLocaleDateString()})`}
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                  />
                                ))}
                                {studentFees.filter(fee => fee.status === 'paid').length === 0 && (
                                  <Typography variant="body2" color="text.secondary">
                                    No payments recorded yet
                                  </Typography>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      );
                    })()}
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate('/school/fees', {
                          state: {
                            searchStudent: formData.student_name,
                            studentId: selectedRecord?._id
                          }
                        });
                      }}
                      sx={{
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)'
                        }
                      }}
                    >
                      Manage Fees
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        // Refresh fees data
                        const savedFees = localStorage.getItem('feesManagement_fees');
                        const allFees = savedFees ? JSON.parse(savedFees) : [];
                        const studentFees = allFees.filter(fee => fee.studentId === selectedRecord?._id);

                        if (studentFees.length > 0) {
                          // Recalculate totals based on detailed fees
                          const totalFees = studentFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
                          const paidFees = studentFees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + (fee.amount || 0), 0);
                          const balanceFees = totalFees - paidFees;

                          setFormData(prev => ({
                            ...prev,
                            fees: {
                              ...prev.fees,
                              total_fees: totalFees,
                              paid_fees: paidFees,
                              balance_fees: balanceFees
                            }
                          }));

                          setSnackbar({ open: true, message: 'Fees data refreshed!', severity: 'success' });
                        }
                      }}
                    >
                      Refresh Fees
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ) : (
              // Edit mode - simpler fields
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Total Fees (₹)"
                    name="fees.total_fees"
                    type="number"
                    value={formData.fees.total_fees}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: '₹'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Paid Fees (₹)"
                    name="fees.paid_fees"
                    type="number"
                    value={formData.fees.paid_fees}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: '₹'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Balance Fees (₹)"
                    name="fees.balance_fees"
                    type="number"
                    value={formData.fees.balance_fees}
                    disabled={true}
                    InputProps={{
                      startAdornment: '₹',
                      readOnly: true
                    }}
                    helperText="Auto-calculated (Total - Paid)"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Transport Fees (₹)"
                    name="fees.transport_fees"
                    type="number"
                    value={formData.fees.transport_fees}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: '₹'
                    }}
                    helperText="Automatically added to total fees"
                  />
                </Grid>
              </>
            )}
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogMode !== 'view' && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={dialogMode === 'create' && studentNameExists !== true}
            >
              {dialogMode === 'create'
                ? (studentNameExists === true ? 'Create Student Record' : 'Verify Student Name First')
                : 'Update'
              }
            </Button>
          )}
        </DialogActions>
      </Dialog>

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

export default StudentRecords;
