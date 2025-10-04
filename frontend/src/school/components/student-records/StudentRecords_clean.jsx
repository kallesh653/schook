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
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GetApp as DownloadIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../environment';

const StudentRecords = () => {
  const [records, setRecords] = useState([]);
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
      tuition_fees: 0,
      transport_fees: 0,
      hostel_fees: 0,
      library_fees: 0,
      lab_fees: 0,
      sports_fees: 0,
      examination_fees: 0,
      miscellaneous_fees: 0,
      advance_fees: 0,
      paid_fees: 0,
      total_fees: 0,
      balance_fees: 0
    },
    previous_school: '',
    medical_conditions: '',
    transport_required: false,
    hostel_required: false,
    status: 'Active'
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [recordsRes, statsRes] = await Promise.all([
        axios.get(`${baseUrl}/student-records`, { headers }),
        axios.get(`${baseUrl}/student-records/stats`, { headers })
      ]);

      setRecords(recordsRes.data.data || []);
      setStats(statsRes.data.data || {});
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Error fetching data', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (!formData.student_name || formData.student_name.trim() === '') {
        setSnackbar({ open: true, message: 'Please enter student name', severity: 'error' });
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

      // Calculate totals
      cleanedData.fees.total_fees = Object.keys(cleanedData.fees)
        .filter(key => !['paid_fees', 'total_fees', 'balance_fees'].includes(key))
        .reduce((sum, key) => sum + cleanedData.fees[key], 0);

      cleanedData.fees.balance_fees =
        cleanedData.fees.total_fees - cleanedData.fees.paid_fees;

      if (dialogMode === 'edit') {
        await axios.put(`${baseUrl}/student-records/${selectedRecord._id}`, cleanedData, { headers });
        setSnackbar({ open: true, message: 'Student record updated successfully!', severity: 'success' });
      } else {
        await axios.post(`${baseUrl}/student-records`, cleanedData, { headers });
        setSnackbar({ open: true, message: 'Student record created successfully!', severity: 'success' });
      }

      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving student record:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error saving student record';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        await axios.delete(`${baseUrl}/student-records/${id}`, { headers });
        setSnackbar({ open: true, message: 'Student record deleted successfully!', severity: 'success' });
        fetchData();
      } catch (error) {
        console.error('Error deleting record:', error);
        setSnackbar({ open: true, message: 'Error deleting record', severity: 'error' });
      }
    }
  };

  const handleOpenDialog = (mode, record = null) => {
    setDialogMode(mode);
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
        tuition_fees: 0,
        transport_fees: 0,
        hostel_fees: 0,
        library_fees: 0,
        lab_fees: 0,
        sports_fees: 0,
        examination_fees: 0,
        miscellaneous_fees: 0,
        advance_fees: 0,
        paid_fees: 0,
        total_fees: 0,
        balance_fees: 0
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

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleDownloadPDF = async (id, studentName) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${baseUrl}/student-records/${id}/pdf`, { headers });

      if (response.data.success) {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(response.data.data.htmlContent);
        printWindow.document.close();

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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Student Records Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
          sx={{ bgcolor: 'primary.main' }}
        >
          Add New Student
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stats.totalStudents}</Typography>
                  <Typography variant="body2">Total Students</Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stats.activeStudents}</Typography>
                  <Typography variant="body2">Active Students</Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)', color: '#333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">₹{stats.totalFeesCollected.toLocaleString()}</Typography>
                  <Typography variant="body2">Fees Collected</Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: '#333' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">₹{stats.totalFeesBalance.toLocaleString()}</Typography>
                  <Typography variant="body2">Balance Fees</Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Records Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Roll No.</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Parent Phone</TableCell>
                  <TableCell>Total Fees</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.student_name}</TableCell>
                    <TableCell>{record.roll_number}</TableCell>
                    <TableCell>{record.class || 'N/A'}</TableCell>
                    <TableCell>{record.section}</TableCell>
                    <TableCell>{record.phone_number}</TableCell>
                    <TableCell>₹{(record.fees?.total_fees || 0).toLocaleString()}</TableCell>
                    <TableCell>₹{(record.fees?.balance_fees || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={getStatusColor(record.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton onClick={() => handleOpenDialog('view', record)} size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpenDialog('edit', record)} size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download PDF">
                        <IconButton onClick={() => handleDownloadPDF(record._id, record.student_name)} size="small">
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(record._id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' && 'Add New Student Record'}
          {dialogMode === 'edit' && 'Edit Student Record'}
          {dialogMode === 'view' && 'View Student Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Name"
                name="student_name"
                value={formData.student_name}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
                required
              />
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
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Fees Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tuition Fees"
                name="fees.tuition_fees"
                type="number"
                value={formData.fees.tuition_fees}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Transport Fees"
                name="fees.transport_fees"
                type="number"
                value={formData.fees.transport_fees}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hostel Fees"
                name="fees.hostel_fees"
                type="number"
                value={formData.fees.hostel_fees}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Library Fees"
                name="fees.library_fees"
                type="number"
                value={formData.fees.library_fees}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lab Fees"
                name="fees.lab_fees"
                type="number"
                value={formData.fees.lab_fees}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sports Fees"
                name="fees.sports_fees"
                type="number"
                value={formData.fees.sports_fees}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Examination Fees"
                name="fees.examination_fees"
                type="number"
                value={formData.fees.examination_fees}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Miscellaneous Fees"
                name="fees.miscellaneous_fees"
                type="number"
                value={formData.fees.miscellaneous_fees}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Advance Fees"
                name="fees.advance_fees"
                type="number"
                value={formData.fees.advance_fees}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Paid Fees"
                name="fees.paid_fees"
                type="number"
                value={formData.fees.paid_fees}
                onChange={handleInputChange}
                disabled={dialogMode === 'view'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogMode !== 'view' && (
            <Button onClick={handleSubmit} variant="contained">
              {dialogMode === 'create' ? 'Create' : 'Update'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
