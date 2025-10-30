import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import * as yup from 'yup';

// Icons
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

// Styled Components
const StyledHeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  '& .MuiTableCell-head': {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f8f9ff',
  },
  '&:hover': {
    backgroundColor: '#e3f2fd',
    transform: 'scale(1.01)',
    transition: 'all 0.2s ease-in-out',
  },
}));

const ActionButton = styled(IconButton)(({ theme, color }) => ({
  borderRadius: '10px',
  margin: theme.spacing(0.5),
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: color === 'error' ? '#ffebee' : '#e3f2fd',
  },
  transition: 'all 0.2s ease-in-out',
}));

// Validation Schema
const transportFeesSchema = yup.object({
  location_name: yup.string().required('Location name is required'),
  monthly_fee: yup.number().required('Monthly fee is required').min(0, 'Fee must be positive'),
  distance: yup.string(),
  annual_fee: yup.number().min(0, 'Annual fee must be positive'),
  description: yup.string(),
});

export default function TransportFees() {
  const [transportFees, setTransportFees] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // MESSAGE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    location_name: "",
    distance: "",
    monthly_fee: "",
    annual_fee: "",
    description: "",
  };

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: transportFeesSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");

        if (isEdit) {
          const response = await axios.patch(
            `${baseUrl}/transport-fees/update/${editId}`,
            values,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setMessage(response.data.message);
          setType("success");
          cancelEdit();
        } else {
          const response = await axios.post(
            `${baseUrl}/transport-fees/create`,
            values,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setMessage(response.data.message);
          setType("success");
          Formik.resetForm();
        }
        setOpenDialog(false);
        fetchTransportFees();
      } catch (e) {
        setMessage(e.response?.data?.message || 'Operation failed');
        setType("error");
        console.log("Error:", e);
      }
    },
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transport location?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `${baseUrl}/transport-fees/delete/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setMessage(response.data.message);
        setType("success");
        fetchTransportFees();
      } catch (e) {
        setMessage(e.response?.data?.message || 'Delete failed');
        setType("error");
        console.log("Error deleting:", e);
      }
    }
  };

  const handleEdit = async (id) => {
    setEdit(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseUrl}/transport-fees/fetch-single/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = response.data.data;
      Formik.setFieldValue("location_name", data.location_name);
      Formik.setFieldValue("distance", data.distance || '');
      Formik.setFieldValue("monthly_fee", data.monthly_fee);
      Formik.setFieldValue("annual_fee", data.annual_fee || '');
      Formik.setFieldValue("description", data.description || '');
      setEditId(data._id);
      setOpenDialog(true);
    } catch (e) {
      setMessage("Error fetching data for edit");
      setType("error");
      console.log("Error in fetching edit data:", e);
    }
  };

  const toggleActiveStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${baseUrl}/transport-fees/toggle-status/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage(response.data.message);
      setType("success");
      fetchTransportFees();
    } catch (e) {
      setMessage(e.response?.data?.message || 'Toggle failed');
      setType("error");
    }
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.resetForm();
    setOpenDialog(false);
  };

  const fetchTransportFees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseUrl}/transport-fees/fetch-all`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTransportFees(response.data.data);
    } catch (e) {
      console.log("Error in fetching transport fees:", e);
      setMessage("Error fetching transport fees");
      setType("error");
    }
  };

  useEffect(() => {
    fetchTransportFees();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {message && (
        <CustomizedSnackbars
          reset={resetMessage}
          type={type}
          message={message}
        />
      )}

      {/* Header Card */}
      <StyledHeaderCard>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <DirectionsBusIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Transport Fees Management
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Manage transport fees for different locations
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            Add New Location
          </Button>
        </CardContent>
      </StyledHeaderCard>

      {/* Transport Fees Table */}
      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <StyledTableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon />
                  Location
                </Box>
              </TableCell>
              <TableCell align="center">Distance</TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <AttachMoneyIcon />
                  Monthly Fee
                </Box>
              </TableCell>
              <TableCell align="center">Annual Fee</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {transportFees && transportFees.length > 0 ? (
              transportFees.map((location, index) => (
                <StyledTableRow key={index}>
                  <TableCell>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {location.location_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1">
                      {location.distance || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                      ₹{location.monthly_fee}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" sx={{ color: '#4caf50' }}>
                      ₹{location.annual_fee || (location.monthly_fee * 12)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {location.description || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Toggle Active Status">
                      <IconButton
                        onClick={() => toggleActiveStatus(location._id)}
                        color={location.is_active ? 'success' : 'default'}
                      >
                        {location.is_active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Box>
                      <Tooltip title="Edit Location">
                        <ActionButton
                          color="primary"
                          onClick={() => handleEdit(location._id)}
                        >
                          <EditIcon />
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Delete Location">
                        <ActionButton
                          color="error"
                          onClick={() => handleDelete(location._id)}
                        >
                          <DeleteIcon sx={{ color: '#f44336' }} />
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No transport locations found. Add your first location!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={cancelEdit} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea' }}>
            {isEdit ? "Edit Transport Location" : "Add New Transport Location"}
          </Typography>
        </DialogTitle>
        <form onSubmit={Formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location Name *"
                  name="location_name"
                  value={Formik.values.location_name}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.location_name && Boolean(Formik.errors.location_name)}
                  helperText={Formik.touched.location_name && Formik.errors.location_name}
                  placeholder="e.g., Main Street, Downtown"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Distance"
                  name="distance"
                  value={Formik.values.distance}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  placeholder="e.g., 5 km, 10 miles"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Monthly Fee *"
                  name="monthly_fee"
                  type="number"
                  value={Formik.values.monthly_fee}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.monthly_fee && Boolean(Formik.errors.monthly_fee)}
                  helperText={Formik.touched.monthly_fee && Formik.errors.monthly_fee}
                  placeholder="Enter monthly fee"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Annual Fee"
                  name="annual_fee"
                  type="number"
                  value={Formik.values.annual_fee}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  error={Formik.touched.annual_fee && Boolean(Formik.errors.annual_fee)}
                  helperText={Formik.touched.annual_fee && Formik.errors.annual_fee || "Leave empty to auto-calculate (Monthly × 12)"}
                  placeholder="Auto-calculated if empty"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={Formik.values.description}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  placeholder="Additional information about this route..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={cancelEdit} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              }}
            >
              {isEdit ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
