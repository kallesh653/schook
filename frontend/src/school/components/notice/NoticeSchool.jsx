import { useEffect, useState } from "react";
import {
  Box, Button, MenuItem, Paper, Select, TextField, Typography, IconButton,
  Card, CardContent, CardActions, Chip, Grid, Container, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Alert, Snackbar, Badge, Avatar, Fab, Tooltip
} from "@mui/material";
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MessageIcon from '@mui/icons-material/Message';
import axios from "axios";
import { baseUrl } from "../../../environment";

// Styled Components
const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
}));

const StyledNoticeCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  marginBottom: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
}));

const StyledFilterButton = styled(Button)(({ theme, active }) => ({
  borderRadius: '25px',
  margin: theme.spacing(0.5),
  textTransform: 'none',
  fontWeight: 'bold',
  background: active ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' : 'transparent',
  color: active ? 'white' : theme.palette.primary.main,
  border: `2px solid ${theme.palette.primary.main}`,
  '&:hover': {
    background: active ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' : '#e3f2fd',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF5722 30%, #FF6B6B 90%)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease-in-out',
}));

const NoticeSchool = () => {
  const [formData, setFormData] = useState({ title: "", message: "", audience: "" });
  const [notices, setNotices] = useState([]);
  const [audience, setAudience] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editNoticeId, setEditNoticeId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper function to show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch Notices based on Audience
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/notices/fetch/${audience}`);
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices", error);
      showSnackbar("Failed to fetch notices", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [audience]);

  // Add or Edit Notice
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`${baseUrl}/notices/${editNoticeId}`, formData);
        showSnackbar("Notice updated successfully!");
        setIsEditing(false);
        setEditNoticeId(null);
      } else {
        await axios.post(`${baseUrl}/notices/add`, formData);
        showSnackbar("Notice added successfully!");
      }

      setFormData({ title: "", message: "", audience: "" });
      setOpenDialog(false);
      fetchNotices();
    } catch (error) {
      showSnackbar(isEditing ? "Failed to update notice" : "Failed to add notice", "error");
    } finally {
      setLoading(false);
    }
  };

  // Set form data for editing
  const handleEdit = (notice) => {
    setFormData({ title: notice.title, message: notice.message, audience: notice.audience });
    setIsEditing(true);
    setEditNoticeId(notice._id);
    setOpenDialog(true);
  };

  // Delete Notice
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setLoading(true);
      try {
        await axios.delete(`${baseUrl}/notices/${id}`);
        showSnackbar("Notice deleted successfully!");
        fetchNotices();
      } catch (error) {
        showSnackbar("Failed to delete notice", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper function to get audience icon
  const getAudienceIcon = (audience) => {
    switch (audience) {
      case 'student': return <PersonIcon />;
      case 'teacher': return <SchoolIcon />;
      default: return <GroupIcon />;
    }
  };

  // Helper function to get audience color
  const getAudienceColor = (audience) => {
    switch (audience) {
      case 'student': return 'primary';
      case 'teacher': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <StyledHeaderCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 56, height: 56 }}>
              <NotificationsIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
              Notice Board
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Manage and share important announcements
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Chip
              icon={<Badge badgeContent={notices.filter(n => n.audience === 'student').length} color="secondary"><PersonIcon /></Badge>}
              label="Students"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
            />
            <Chip
              icon={<Badge badgeContent={notices.filter(n => n.audience === 'teacher').length} color="secondary"><SchoolIcon /></Badge>}
              label="Teachers"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
            />
            <Chip
              icon={<Badge badgeContent={notices.length} color="secondary"><GroupIcon /></Badge>}
              label="Total Notices"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
            />
          </Box>
        </CardContent>
      </StyledHeaderCard>

      {/* Filter Section */}
      <Card sx={{ mb: 3, borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: { xs: 2, md: 0 } }}>
              📋 Notice For: <span style={{ color: '#e74c3c', textTransform: 'capitalize' }}>{audience}</span>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <StyledFilterButton
                active={audience === "all"}
                onClick={() => setAudience("all")}
                startIcon={<GroupIcon />}
              >
                All Notices
              </StyledFilterButton>
              <StyledFilterButton
                active={audience === "student"}
                onClick={() => setAudience("student")}
                startIcon={<PersonIcon />}
              >
                Students
              </StyledFilterButton>
              <StyledFilterButton
                active={audience === "teacher"}
                onClick={() => setAudience("teacher")}
                startIcon={<SchoolIcon />}
              >
                Teachers
              </StyledFilterButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Notices Grid */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: 200, borderRadius: '15px' }}>
                <CardContent>
                  <Box sx={{ bgcolor: '#f5f5f5', height: '100%', borderRadius: '10px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : notices.length > 0 ? (
          notices.map((notice) => (
            <Grid item xs={12} md={6} lg={4} key={notice._id}>
              <StyledNoticeCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      icon={getAudienceIcon(notice.audience)}
                      label={notice.audience.toUpperCase()}
                      color={getAudienceColor(notice.audience)}
                      variant="outlined"
                      size="small"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {new Date(notice.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#2c3e50' }}>
                    {notice.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#7f8c8d', lineHeight: 1.6, mb: 2 }}>
                    {notice.message.length > 100
                      ? `${notice.message.substring(0, 100)}...`
                      : notice.message
                    }
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#95a5a6' }}>
                    <MessageIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      {notice.message.length} characters
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title="Edit Notice">
                      <IconButton
                        onClick={() => handleEdit(notice)}
                        sx={{
                          color: '#3498db',
                          '&:hover': { bgcolor: '#ebf3fd' }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Notice">
                      <IconButton
                        onClick={() => handleDelete(notice._id)}
                        sx={{
                          color: '#e74c3c',
                          '&:hover': { bgcolor: '#ffeaea' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </StyledNoticeCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', py: 8, borderRadius: '15px' }}>
              <CardContent>
                <NotificationsIcon sx={{ fontSize: 80, color: '#bdc3c7', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#7f8c8d', mb: 1 }}>
                  No notices found
                </Typography>
                <Typography variant="body1" sx={{ color: '#95a5a6' }}>
                  Create your first notice to get started
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Floating Action Button */}
      <StyledFab
        onClick={() => {
          setFormData({ title: "", message: "", audience: "" });
          setIsEditing(false);
          setEditNoticeId(null);
          setOpenDialog(true);
        }}
      >
        <AddIcon />
      </StyledFab>

      {/* Add/Edit Notice Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '15px' }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          {isEditing ? "Edit Notice" : "Create New Notice"}
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <TextField
              label="Notice Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Notice Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Target Audience</InputLabel>
              <Select
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                label="Target Audience"
              >
                <MenuItem value="student">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Students
                  </Box>
                </MenuItem>
                <MenuItem value="teacher">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon sx={{ mr: 1 }} />
                    Teachers
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setIsEditing(false);
                setFormData({ title: "", message: "", audience: "" });
                setEditNoticeId(null);
              }}
              sx={{ borderRadius: '25px' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: '25px',
                background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5722 30%, #FF6B6B 90%)',
                }
              }}
            >
              {loading ? "Saving..." : (isEditing ? "Update Notice" : "Create Notice")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: '10px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NoticeSchool;
