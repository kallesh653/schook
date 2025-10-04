import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../environment";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Container, Chip, Card, CardContent } from "@mui/material";
import { convertDate } from "../../../utilityFunctions";
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Styled components for beautiful design
const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  marginBottom: theme.spacing(3),
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  marginTop: theme.spacing(2),
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
  cursor: 'pointer',
}));

const ExamTypeChip = styled(Chip)(({ examtype }) => ({
  fontWeight: 'bold',
  ...(examtype === 'Final' && {
    backgroundColor: '#ff5722',
    color: 'white',
  }),
  ...(examtype === 'Midterm' && {
    backgroundColor: '#ff9800',
    color: 'white',
  }),
  ...(examtype === 'Quiz' && {
    backgroundColor: '#4caf50',
    color: 'white',
  }),
  ...(examtype === 'Assignment' && {
    backgroundColor: '#9c27b0',
    color: 'white',
  }),
}));

export default function StudentExaminations(){
    
  
    // const [classId, setClassId] = useState(null)
    const [examinations, setExaminations] = useState([]);
    const [classDetails, setClassDetails] = useState(null)
    const fetchExaminations = (classId) => {
      axios
        .get(`${baseUrl}/examination/fetch-class/${classId}`)
        .then((resp) => {
          console.log("ALL Examination", resp);
          setExaminations(resp.data.data);
        })
        .catch((e) => {
          console.log("Error in fetching  Examinstions.");
        });
    };

    const getStudentDetails = ()=>{
      axios.get(`${baseUrl}/student/fetch-own`).then(resp=>{
          fetchExaminations(resp.data.data.student_class._id);
          setClassDetails({id:resp.data.data.student_class._id, class:resp.data.data.student_class.class_text})
  console.log("student",  resp)
      }).catch(e=>{
          console.log("Error in student", e)
      })
  }

useEffect(()=>{
  getStudentDetails();
   
},[])
    return(
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header Card */}
          <StyledCard>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <SchoolIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h3" component="h1" gutterBottom>
                My Examinations
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Class: {classDetails && classDetails.class}
              </Typography>
            </CardContent>
          </StyledCard>

          {/* Examinations Table */}
          <Paper elevation={0}>
            <StyledTableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="examinations table">
                <StyledTableHead>
                  <TableRow>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon />
                        Exam Date
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BookIcon />
                        Subject
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <AssignmentIcon />
                        Exam Type
                      </Box>
                    </TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {examinations && examinations.length > 0 ? (
                    examinations.map((examination, i) => (
                      <StyledTableRow key={i}>
                        <TableCell component="th" scope="row">
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {convertDate(examination.examDate)}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="body1" sx={{ color: '#1976d2', fontWeight: 'medium' }}>
                            {examination.subject.subject_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <ExamTypeChip 
                            label={examination.examType}
                            examtype={examination.examType}
                            size="medium"
                          />
                        </TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                          No examinations scheduled
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </Paper>
        </Container>
    )
}