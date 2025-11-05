import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  FormGroup,
  Checkbox,
  Divider,
  Avatar,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Shield as ShieldIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { baseUrl } from '../../../environment';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'ADMIN',
    permissions: {
      can_manage_students: true,
      can_manage_teachers: true,
      can_manage_classes: true,
      can_manage_fees: true,
      can_manage_exams: true,
      can_manage_attendance: true,
      can_view_reports: true,
      can_manage_admins: false,
      can_delete_records: false,
      can_modify_school_settings: false,
    },
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchAdmins();
  }, []);

  const fetchCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admins');
      console.error('Fetch admins error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (admin = null) => {
    if (admin) {
      setSelectedAdmin(admin);
      setFormData({
        full_name: admin.full_name,
        email: admin.email,
        password: '',
        phone: admin.phone || '',
        role: admin.role,
        permissions: { ...admin.permissions },
      });
    } else {
      setSelectedAdmin(null);
      setFormData({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        role: 'ADMIN',
        permissions: {
          can_manage_students: true,
          can_manage_teachers: true,
          can_manage_classes: true,
          can_manage_fees: true,
          can_manage_exams: true,
          can_manage_attendance: true,
          can_view_reports: true,
          can_manage_admins: false,
          can_delete_records: false,
          can_modify_school_settings: false,
        },
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAdmin(null);
    setShowPassword(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    const isSuperAdmin = role === 'SUPER_ADMIN';

    setFormData({
      ...formData,
      role,
      permissions: {
        ...formData.permissions,
        can_manage_admins: isSuperAdmin,
        can_delete_records: isSuperAdmin,
        can_modify_school_settings: isSuperAdmin,
      },
    });
  };

  const handlePermissionChange = (permission) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: !formData.permissions[permission],
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      if (selectedAdmin) {
        // Update existing admin
        const updateData = {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          permissions: formData.permissions,
        };

        await axios.put(`${baseUrl}/admin/${selectedAdmin._id}`, updateData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Admin updated successfully');
      } else {
        // Create new admin
        if (!formData.password) {
          setError('Password is required for new admin');
          return;
        }

        await axios.post(`${baseUrl}/admin/create`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Admin created successfully');
      }

      handleCloseDialog();
      fetchAdmins();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save admin');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${baseUrl}/admin/${selectedAdmin._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Admin deleted successfully');
      setOpenDeleteDialog(false);
      fetchAdmins();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete admin');
      setOpenDeleteDialog(false);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleStatus = async (admin) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${baseUrl}/admin/${admin._id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Admin ${admin.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchAdmins();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle admin status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  const permissionGroups = [
    {
      title: 'Student & Teacher Management',
      permissions: [
        { key: 'can_manage_students', label: 'Manage Students' },
        { key: 'can_manage_teachers', label: 'Manage Teachers' },
      ],
    },
    {
      title: 'Academic Management',
      permissions: [
        { key: 'can_manage_classes', label: 'Manage Classes' },
        { key: 'can_manage_exams', label: 'Manage Exams' },
        { key: 'can_manage_attendance', label: 'Manage Attendance' },
      ],
    },
    {
      title: 'Financial Management',
      permissions: [
        { key: 'can_manage_fees', label: 'Manage Fees' },
      ],
    },
    {
      title: 'Reports & System',
      permissions: [
        { key: 'can_view_reports', label: 'View Reports' },
      ],
    },
    {
      title: 'Administrative (SUPER_ADMIN Only)',
      permissions: [
        { key: 'can_manage_admins', label: 'Manage Admins', superAdminOnly: true },
        { key: 'can_delete_records', label: 'Delete Records', superAdminOnly: true },
        { key: 'can_modify_school_settings', label: 'Modify School Settings', superAdminOnly: true },
      ],
    },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
          Admin Management
          {!isSuperAdmin && (
            <Chip
              label="View Only"
              size="small"
              sx={{ ml: 2, backgroundColor: '#8B8B8D', color: 'white' }}
            />
          )}
        </Typography>
        {isSuperAdmin && (
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#DC143C',
              '&:hover': { backgroundColor: '#B71C1C' },
              textTransform: 'none',
              px: 3,
              py: 1.5,
            }}
          >
            Add New Admin
          </Button>
        )}
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search admins by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3, backgroundColor: 'white' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#8B8B8D' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Admin Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress sx={{ color: '#DC143C' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAdmins.map((admin) => (
            <Grid item xs={12} sm={6} md={4} key={admin._id}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  {/* Header with Avatar and Role Badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: admin.role === 'SUPER_ADMIN' ? '#DC143C' : '#8B8B8D',
                      }}
                    >
                      {admin.role === 'SUPER_ADMIN' ? <ShieldIcon /> : <PersonIcon />}
                    </Avatar>
                    <Chip
                      label={admin.role}
                      size="small"
                      sx={{
                        backgroundColor: admin.role === 'SUPER_ADMIN' ? '#DC143C' : '#8B8B8D',
                        color: 'white',
                        fontWeight: 'bold',
                        height: 28,
                      }}
                    />
                  </Box>

                  {/* Admin Info */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                    {admin.full_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    {admin.email}
                  </Typography>
                  {admin.phone && (
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      {admin.phone}
                    </Typography>
                  )}

                  {/* Status Badge */}
                  <Chip
                    label={admin.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      backgroundColor: admin.is_active ? '#4caf50' : '#f44336',
                      color: 'white',
                      fontSize: '0.75rem',
                      mb: 2,
                    }}
                  />

                  <Divider sx={{ my: 2 }} />

                  {/* Last Login */}
                  <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 0.5 }}>
                    Last Login: {formatDate(admin.last_login)}
                  </Typography>

                  {/* Created By */}
                  {admin.created_by && (
                    <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>
                      Created by: {admin.created_by.full_name}
                    </Typography>
                  )}

                  {/* Actions */}
                  {isSuperAdmin && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Tooltip title="Edit Admin">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(admin)}
                          sx={{
                            backgroundColor: '#8B8B8D',
                            color: 'white',
                            '&:hover': { backgroundColor: '#6B6B6D' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={admin.is_active ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(admin)}
                          sx={{
                            backgroundColor: admin.is_active ? '#f44336' : '#4caf50',
                            color: 'white',
                            '&:hover': { backgroundColor: admin.is_active ? '#d32f2f' : '#388e3c' },
                          }}
                        >
                          {admin.is_active ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      {admin._id !== currentUser?.id && (
                        <Tooltip title="Delete Admin">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(admin)}
                            sx={{
                              backgroundColor: '#DC143C',
                              color: 'white',
                              '&:hover': { backgroundColor: '#B71C1C' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Admin Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#DC143C', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{selectedAdmin ? 'Edit Admin' : 'Create New Admin'}</Typography>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#DC143C', mb: 1 }}>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
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
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select value={formData.role} onChange={handleRoleChange}>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!selectedAdmin && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}

            {/* Permissions */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#DC143C', mb: 2 }}>
                Permissions
              </Typography>
            </Grid>

            {permissionGroups.map((group, index) => (
              <Grid item xs={12} key={index}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666', mb: 1 }}>
                  {group.title}
                </Typography>
                <FormGroup>
                  <Grid container spacing={1}>
                    {group.permissions.map((perm) => (
                      <Grid item xs={12} sm={6} key={perm.key}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.permissions[perm.key]}
                              onChange={() => handlePermissionChange(perm.key)}
                              disabled={perm.superAdminOnly && formData.role !== 'SUPER_ADMIN'}
                              sx={{
                                color: '#8B8B8D',
                                '&.Mui-checked': { color: '#DC143C' },
                              }}
                            />
                          }
                          label={perm.label}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#DC143C',
              '&:hover': { backgroundColor: '#B71C1C' },
            }}
          >
            {selectedAdmin ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ color: '#DC143C' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete admin "{selectedAdmin?.full_name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              backgroundColor: '#DC143C',
              '&:hover': { backgroundColor: '#B71C1C' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminManagement;
