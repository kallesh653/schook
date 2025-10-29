import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Paper,
  Alert,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 20px'
});

const StyledCard = styled(Card)({
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  overflow: 'hidden'
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '40px',
  textAlign: 'center'
});

const QuestionCard = styled(Card)({
  padding: '20px',
  marginBottom: '15px',
  background: '#f8f9fa',
  borderLeft: '4px solid #667eea',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(5px)',
    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
  }
});

const QuestionPaperGenerator = () => {
  const [paperInfo, setPaperInfo] = useState({
    schoolName: '',
    examDate: new Date().toISOString().split('T')[0],
    subject: '',
    className: '',
    duration: '3 hours',
    totalMarks: '100'
  });

  const [questions, setQuestions] = useState([
    { id: 1, question: '', marks: '', type: 'short' }
  ]);

  const [showPreview, setShowPreview] = useState(false);

  const questionTypes = [
    { value: 'mcq', label: 'Multiple Choice (MCQ)' },
    { value: 'short', label: 'Short Answer' },
    { value: 'long', label: 'Long Answer' },
    { value: 'essay', label: 'Essay' }
  ];

  const handlePaperInfoChange = (field, value) => {
    setPaperInfo({ ...paperInfo, [field]: value });
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId, question: '', marks: '', type: 'short' }]);
  };

  const deleteQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const calculateTotalMarks = () => {
    return questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 20;

    // Header - School Name
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text(paperInfo.schoolName || 'School Name', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 10;

    // Horizontal line under school name
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);

    yPosition += 10;

    // Exam Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('EXAMINATION QUESTION PAPER', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;

    // Exam Details Box
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');

    yPosition += 8;

    // Details in two columns
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    // Left column
    doc.text('Subject:', margin + 5, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(paperInfo.subject || '_______________', margin + 25, yPosition);

    doc.setFont('helvetica', 'bold');
    doc.text('Class:', margin + 5, yPosition + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(paperInfo.className || '_______________', margin + 25, yPosition + 7);

    // Right column
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', pageWidth / 2 + 10, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(paperInfo.examDate || '_______________', pageWidth / 2 + 30, yPosition);

    doc.setFont('helvetica', 'bold');
    doc.text('Duration:', pageWidth / 2 + 10, yPosition + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(paperInfo.duration || '_______________', pageWidth / 2 + 30, yPosition + 7);

    doc.setFont('helvetica', 'bold');
    doc.text('Total Marks:', pageWidth / 2 + 10, yPosition + 14);
    doc.setFont('helvetica', 'normal');
    doc.text(paperInfo.totalMarks || '_______________', pageWidth / 2 + 35, yPosition + 14);

    yPosition += 30;

    // Instructions Box
    yPosition += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('INSTRUCTIONS:', margin, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.text('• All questions are compulsory.', margin + 5, yPosition);
    yPosition += 5;
    doc.text('• Write your answers in the answer sheet provided.', margin + 5, yPosition);
    yPosition += 5;
    doc.text('• Read the questions carefully before answering.', margin + 5, yPosition);

    yPosition += 10;

    // Horizontal line before questions
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);

    yPosition += 10;

    // Questions Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('QUESTIONS', margin, yPosition);

    yPosition += 10;

    // Group questions by type
    const groupedQuestions = {};
    questions.forEach(q => {
      if (!groupedQuestions[q.type]) {
        groupedQuestions[q.type] = [];
      }
      groupedQuestions[q.type].push(q);
    });

    let questionNumber = 1;
    const typeLabels = {
      'mcq': 'Multiple Choice Questions',
      'short': 'Short Answer Questions',
      'long': 'Long Answer Questions',
      'essay': 'Essay Questions'
    };

    Object.keys(groupedQuestions).forEach((type, sectionIndex) => {
      if (sectionIndex > 0) {
        yPosition += 5;
      }

      // Section heading
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 126, 234);
      doc.text(`Section ${String.fromCharCode(65 + sectionIndex)}: ${typeLabels[type]}`, margin, yPosition);
      yPosition += 8;

      groupedQuestions[type].forEach((q, index) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        // Question number and text
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Q${questionNumber}.`, margin, yPosition);

        doc.setFont('helvetica', 'normal');
        const questionText = q.question || 'Question text here';
        const splitQuestion = doc.splitTextToSize(questionText, pageWidth - margin - 50);
        doc.text(splitQuestion, margin + 10, yPosition);

        // Marks in box on the right
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`[${q.marks || '0'} marks]`, pageWidth - margin - 25, yPosition, { align: 'right' });

        yPosition += splitQuestion.length * 5 + 3;

        // Answer space
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('Answer:', margin + 10, yPosition);
        yPosition += 5;

        // Lines for answer
        const answerLines = type === 'essay' ? 8 : type === 'long' ? 5 : 3;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        for (let i = 0; i < answerLines; i++) {
          doc.line(margin + 10, yPosition, pageWidth - margin, yPosition);
          yPosition += 7;
        }

        yPosition += 5;
        questionNumber++;
      });
    });

    // Footer on last page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 285, { align: 'center' });
      doc.text('*** End of Question Paper ***', pageWidth / 2, 290, { align: 'center' });
    }

    // Save PDF
    const fileName = `${paperInfo.subject || 'Exam'}_${paperInfo.className || 'Class'}_${paperInfo.examDate}.pdf`;
    doc.save(fileName);
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <StyledCard>
          <Header>
            <SchoolIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 900 }}>
              📝 Question Paper Generator
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Create professional exam question papers with PDF download
            </Typography>
          </Header>

          <Box sx={{ p: 4 }}>
            {/* Exam Information */}
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3, color: '#667eea' }}>
              Exam Information
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Name"
                  value={paperInfo.schoolName}
                  onChange={(e) => handlePaperInfoChange('schoolName', e.target.value)}
                  placeholder="Enter school name"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Exam Date"
                  type="date"
                  value={paperInfo.examDate}
                  onChange={(e) => handlePaperInfoChange('examDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={paperInfo.subject}
                  onChange={(e) => handlePaperInfoChange('subject', e.target.value)}
                  placeholder="e.g., Mathematics"
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Class"
                  value={paperInfo.className}
                  onChange={(e) => handlePaperInfoChange('className', e.target.value)}
                  placeholder="e.g., Class 10-A"
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={paperInfo.duration}
                  onChange={(e) => handlePaperInfoChange('duration', e.target.value)}
                  placeholder="3 hours"
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Total Marks"
                  value={paperInfo.totalMarks}
                  onChange={(e) => handlePaperInfoChange('totalMarks', e.target.value)}
                  placeholder="100"
                  required
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Questions Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#667eea' }}>
                Questions
              </Typography>
              <Box>
                <Chip
                  label={`Total: ${calculateTotalMarks()} / ${paperInfo.totalMarks} marks`}
                  color={calculateTotalMarks() <= parseInt(paperInfo.totalMarks) ? 'success' : 'error'}
                  sx={{ mr: 2, fontWeight: 'bold' }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addQuestion}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Add Question
                </Button>
              </Box>
            </Box>

            {questions.length === 0 && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Click "Add Question" to start creating your question paper.
              </Alert>
            )}

            {questions.map((q, index) => (
              <QuestionCard key={q.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#667eea' }}>
                    Question {index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => deleteQuestion(q.id)}
                    disabled={questions.length === 1}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Question"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(q.id, 'question', e.target.value)}
                      placeholder="Enter your question here..."
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Question Type</InputLabel>
                      <Select
                        value={q.type}
                        label="Question Type"
                        onChange={(e) => handleQuestionChange(q.id, 'type', e.target.value)}
                      >
                        {questionTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Marks"
                      value={q.marks}
                      onChange={(e) => handleQuestionChange(q.id, 'marks', e.target.value)}
                      placeholder="e.g., 5"
                      inputProps={{ min: 1 }}
                      required
                    />
                  </Grid>
                </Grid>
              </QuestionCard>
            ))}

            <Divider sx={{ my: 4 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={<PreviewIcon />}
                onClick={() => setShowPreview(!showPreview)}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  borderWidth: '2px',
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderWidth: '2px',
                    background: 'rgba(102, 126, 234, 0.1)'
                  }
                }}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<DownloadIcon />}
                onClick={generatePDF}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 'bold',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.5)'
                  }
                }}
              >
                Download PDF
              </Button>
            </Box>

            {/* Preview Section */}
            {showPreview && (
              <Paper sx={{ mt: 4, p: 4, background: '#f8f9fa' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center" sx={{ color: '#667eea' }}>
                  📄 Paper Preview
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#667eea' }}>
                    {paperInfo.schoolName || 'School Name'}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    EXAMINATION QUESTION PAPER
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3, background: 'white', p: 2, borderRadius: 2 }}>
                  <Grid item xs={6}>
                    <Typography><strong>Subject:</strong> {paperInfo.subject || '_______________'}</Typography>
                    <Typography><strong>Class:</strong> {paperInfo.className || '_______________'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography><strong>Date:</strong> {paperInfo.examDate || '_______________'}</Typography>
                    <Typography><strong>Duration:</strong> {paperInfo.duration || '_______________'}</Typography>
                    <Typography><strong>Total Marks:</strong> {paperInfo.totalMarks || '_______________'}</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3, p: 2, background: 'white', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>INSTRUCTIONS:</Typography>
                  <Typography variant="body2">• All questions are compulsory.</Typography>
                  <Typography variant="body2">• Write your answers in the answer sheet provided.</Typography>
                  <Typography variant="body2">• Read the questions carefully before answering.</Typography>
                </Box>

                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#667eea' }}>
                  QUESTIONS
                </Typography>

                {questions.map((q, index) => (
                  <Box key={q.id} sx={{ mb: 3, p: 2, background: 'white', borderRadius: 2, borderLeft: '4px solid #667eea' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="bold">
                        Q{index + 1}. {q.question || 'Question text here'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                        [{q.marks || '0'} marks]
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                      Type: {questionTypes.find(t => t.value === q.type)?.label}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        </StyledCard>
      </Container>
    </PageContainer>
  );
};

export default QuestionPaperGenerator;
