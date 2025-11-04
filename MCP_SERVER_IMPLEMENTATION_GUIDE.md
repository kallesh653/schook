# MCP Server Implementation Guide - Exam & Quiz System

## Table of Contents
1. [What is MCP?](#what-is-mcp)
2. [MCP Server Architecture](#mcp-server-architecture)
3. [Free vs Paid MCP Servers](#free-vs-paid-mcp-servers)
4. [Exam System MCP Server](#exam-system-mcp-server)
5. [Implementation Steps](#implementation-steps)
6. [Integration with School Management System](#integration-with-school-management-system)
7. [Security & Best Practices](#security--best-practices)

---

## What is MCP?

**Model Context Protocol (MCP)** is an open protocol developed by Anthropic that enables AI assistants like Claude to:
- Connect securely to external data sources
- Execute tools and commands
- Access local files and databases
- Interact with third-party APIs

### Key Benefits:
- **Standardized**: One protocol for all integrations
- **Secure**: Built-in authentication and permissions
- **Flexible**: Works with any data source or tool
- **Extensible**: Easy to add new capabilities

---

## MCP Server Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Claude AI                            │
│                  (MCP Client)                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ MCP Protocol (JSON-RPC)
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    MCP Server                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tools (Functions that Claude can call)              │  │
│  │  - create_exam()                                     │  │
│  │  - submit_answer()                                   │  │
│  │  - grade_exam()                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Resources (Data that Claude can read)               │  │
│  │  - Questions database                                │  │
│  │  - Student submissions                               │  │
│  │  - Grading rubrics                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Prompts (Templates Claude can use)                  │  │
│  │  - Exam generation template                          │  │
│  │  - Grading guidelines                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              Your Application                               │
│  - MongoDB (Questions, Answers, Grades)                     │
│  - Express API                                              │
│  - React Frontend                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Free vs Paid MCP Servers

### Free MCP Server Options

#### 1. **Self-Hosted MCP Server (Node.js)**
**Cost**: FREE (only hosting costs)

**Setup**:
```bash
npm install @modelcontextprotocol/sdk
```

**Pros**:
- Full control over data
- No API usage fees
- Customizable logic
- Works offline

**Cons**:
- You manage infrastructure
- Need to handle scaling
- Maintenance required

**Best For**:
- School management systems
- Internal tools
- Privacy-sensitive data
- Custom business logic

#### 2. **Local Filesystem MCP**
**Cost**: FREE

**Setup**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/exams"]
    }
  }
}
```

**Best For**:
- Reading/writing exam files
- Document management
- File-based workflows

#### 3. **SQLite MCP**
**Cost**: FREE

**Setup**:
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "/path/to/exams.db"]
    }
  }
}
```

**Best For**:
- Local database access
- Exam data storage
- Quick prototyping

### Paid MCP Server Options

#### 1. **OpenAI GPT-4 Integration**
**Cost**: ~$0.01-0.03 per 1K tokens

**Use Case**:
- AI-powered grading
- Essay evaluation
- Natural language processing

```javascript
// Use OpenAI API for advanced grading
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

#### 2. **Cloud-Hosted MCP (AWS, Google Cloud)**
**Cost**: Pay per compute time

**Setup**:
```bash
# Deploy to AWS Lambda
serverless deploy
```

**Best For**:
- High traffic applications
- Auto-scaling needs
- Global availability

#### 3. **Managed MCP Services**
**Cost**: Varies by provider

Examples:
- **Anthropic Claude API**: ~$0.25-3.00 per million tokens
- **Pinecone** (Vector DB): $70/month for production
- **MongoDB Atlas**: $57+/month for dedicated cluster

---

## Exam System MCP Server

### System Architecture

```
Teacher Creates Exam
       ↓
┌──────────────────────────────────────────┐
│  Teacher Portal                          │
│  - Upload question paper (PDF/JSON)      │
│  - Upload answer key                     │
│  - Set grading rubric                    │
│  - Assign to students                    │
└──────────────┬───────────────────────────┘
               ↓
       MCP Server (Exam Service)
               ↓
┌──────────────────────────────────────────┐
│  Storage Layer                           │
│  - Questions (without answers)           │
│  - Answer Keys (encrypted)               │
│  - Grading Criteria                      │
└──────────────┬───────────────────────────┘
               ↓
       Student Portal
               ↓
┌──────────────────────────────────────────┐
│  Student View                            │
│  - See questions only                    │
│  - Submit answers                        │
│  - View results after grading            │
└──────────────┬───────────────────────────┘
               ↓
     MCP Auto-Grading Service
               ↓
┌──────────────────────────────────────────┐
│  AI Analysis                             │
│  - Compare student answers to key        │
│  - Use Claude/GPT for essay grading      │
│  - Calculate scores                      │
│  - Generate feedback                     │
└──────────────┬───────────────────────────┘
               ↓
       Results to Student
```

### Features

1. **Teacher Capabilities**:
   - Upload question paper (PDF, Word, or structured JSON)
   - Provide answer key
   - Set marking scheme
   - Define grading rubric (for subjective questions)
   - Schedule exam timing
   - View analytics

2. **Student Capabilities**:
   - Access assigned exams
   - View questions only (answers hidden)
   - Submit answers within time limit
   - View grades and feedback
   - Request re-evaluation

3. **AI Grading Capabilities**:
   - Objective questions: Exact match
   - Subjective questions: Semantic similarity
   - Essay grading: Claude-powered analysis
   - Partial marking
   - Feedback generation

---

## Implementation Steps

### Step 1: Create MCP Server Structure

```bash
# Create MCP server directory
mkdir -p api/mcp-servers/exam-server
cd api/mcp-servers/exam-server

# Initialize package
npm init -y

# Install dependencies
npm install @modelcontextprotocol/sdk
npm install dotenv mongoose
```

### Step 2: Create Exam MCP Server (exam-mcp-server.js)

```javascript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);

// Define Exam Schema
const examSchema = new mongoose.Schema({
  examId: String,
  teacherId: String,
  title: String,
  subject: String,
  class: String,
  duration: Number, // minutes
  totalMarks: Number,
  questions: [{
    questionId: String,
    type: String, // 'mcq', 'short', 'long', 'essay'
    question: String,
    options: [String], // for MCQs
    correctAnswer: String, // encrypted
    marks: Number,
    keywords: [String], // for AI grading
  }],
  answerKey: {
    type: String, // encrypted
    encrypted: Boolean
  },
  gradingRubric: String,
  status: String, // 'draft', 'active', 'completed'
  createdAt: Date,
  scheduledAt: Date,
  expiresAt: Date
});

const submissionSchema = new mongoose.Schema({
  submissionId: String,
  examId: String,
  studentId: String,
  studentName: String,
  answers: [{
    questionId: String,
    answer: String,
    timeSpent: Number
  }],
  submittedAt: Date,
  graded: Boolean,
  totalScore: Number,
  feedback: String,
  gradedAt: Date
});

const Exam = mongoose.model('Exam', examSchema);
const Submission = mongoose.model('Submission', submissionSchema);

// Create MCP Server
const server = new Server(
  {
    name: 'exam-grading-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_exam',
        description: 'Teacher creates a new exam with questions and answer key',
        inputSchema: {
          type: 'object',
          properties: {
            teacherId: { type: 'string' },
            title: { type: 'string' },
            subject: { type: 'string' },
            class: { type: 'string' },
            duration: { type: 'number' },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  question: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correctAnswer: { type: 'string' },
                  marks: { type: 'number' },
                  keywords: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            gradingRubric: { type: 'string' }
          },
          required: ['teacherId', 'title', 'questions']
        }
      },
      {
        name: 'get_exam_for_student',
        description: 'Get exam questions for student (without answers)',
        inputSchema: {
          type: 'object',
          properties: {
            examId: { type: 'string' },
            studentId: { type: 'string' }
          },
          required: ['examId', 'studentId']
        }
      },
      {
        name: 'submit_exam',
        description: 'Student submits their exam answers',
        inputSchema: {
          type: 'object',
          properties: {
            examId: { type: 'string' },
            studentId: { type: 'string' },
            studentName: { type: 'string' },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  questionId: { type: 'string' },
                  answer: { type: 'string' }
                }
              }
            }
          },
          required: ['examId', 'studentId', 'answers']
        }
      },
      {
        name: 'grade_exam',
        description: 'AI-powered grading of student exam',
        inputSchema: {
          type: 'object',
          properties: {
            submissionId: { type: 'string' }
          },
          required: ['submissionId']
        }
      },
      {
        name: 'get_student_results',
        description: 'Get graded results for a student',
        inputSchema: {
          type: 'object',
          properties: {
            studentId: { type: 'string' },
            examId: { type: 'string' }
          },
          required: ['studentId', 'examId']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_exam': {
        const totalMarks = args.questions.reduce((sum, q) => sum + q.marks, 0);

        const exam = new Exam({
          examId: `exam_${Date.now()}`,
          teacherId: args.teacherId,
          title: args.title,
          subject: args.subject,
          class: args.class,
          duration: args.duration || 60,
          totalMarks: totalMarks,
          questions: args.questions.map((q, i) => ({
            questionId: `q_${i + 1}`,
            type: q.type,
            question: q.question,
            options: q.options || [],
            correctAnswer: encryptAnswer(q.correctAnswer), // Encrypt answer
            marks: q.marks,
            keywords: q.keywords || []
          })),
          gradingRubric: args.gradingRubric || '',
          status: 'active',
          createdAt: new Date(),
          scheduledAt: args.scheduledAt ? new Date(args.scheduledAt) : new Date()
        });

        await exam.save();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                examId: exam.examId,
                message: `Exam "${args.title}" created successfully with ${args.questions.length} questions`,
                totalMarks: totalMarks
              }, null, 2)
            }
          ]
        };
      }

      case 'get_exam_for_student': {
        const exam = await Exam.findOne({ examId: args.examId });

        if (!exam) {
          throw new Error('Exam not found');
        }

        // Return questions WITHOUT answers
        const studentExam = {
          examId: exam.examId,
          title: exam.title,
          subject: exam.subject,
          duration: exam.duration,
          totalMarks: exam.totalMarks,
          questions: exam.questions.map(q => ({
            questionId: q.questionId,
            type: q.type,
            question: q.question,
            options: q.options,
            marks: q.marks
            // correctAnswer is EXCLUDED
          }))
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(studentExam, null, 2)
            }
          ]
        };
      }

      case 'submit_exam': {
        const submission = new Submission({
          submissionId: `sub_${Date.now()}`,
          examId: args.examId,
          studentId: args.studentId,
          studentName: args.studentName,
          answers: args.answers,
          submittedAt: new Date(),
          graded: false
        });

        await submission.save();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                submissionId: submission.submissionId,
                message: 'Exam submitted successfully. Grading in progress...'
              }, null, 2)
            }
          ]
        };
      }

      case 'grade_exam': {
        const submission = await Submission.findOne({ submissionId: args.submissionId });
        const exam = await Exam.findOne({ examId: submission.examId });

        let totalScore = 0;
        const feedback = [];

        // Grade each answer
        for (const studentAnswer of submission.answers) {
          const question = exam.questions.find(q => q.questionId === studentAnswer.questionId);
          const correctAnswer = decryptAnswer(question.correctAnswer);

          let score = 0;
          let comment = '';

          if (question.type === 'mcq') {
            // Exact match for MCQ
            if (studentAnswer.answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
              score = question.marks;
              comment = 'Correct!';
            } else {
              comment = `Incorrect. Correct answer: ${correctAnswer}`;
            }
          } else {
            // AI-powered grading for subjective questions
            score = await gradeSubjectiveAnswer(
              studentAnswer.answer,
              correctAnswer,
              question.keywords,
              question.marks
            );
            comment = `Score: ${score}/${question.marks} marks`;
          }

          totalScore += score;
          feedback.push({
            questionId: studentAnswer.questionId,
            score: score,
            maxMarks: question.marks,
            comment: comment
          });
        }

        // Update submission with results
        submission.graded = true;
        submission.totalScore = totalScore;
        submission.feedback = JSON.stringify(feedback);
        submission.gradedAt = new Date();
        await submission.save();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                totalScore: totalScore,
                totalMarks: exam.totalMarks,
                percentage: ((totalScore / exam.totalMarks) * 100).toFixed(2),
                feedback: feedback
              }, null, 2)
            }
          ]
        };
      }

      case 'get_student_results': {
        const submission = await Submission.findOne({
          studentId: args.studentId,
          examId: args.examId,
          graded: true
        });

        if (!submission) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ message: 'Results not available yet' })
              }
            ]
          };
        }

        const exam = await Exam.findOne({ examId: args.examId });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                examTitle: exam.title,
                studentName: submission.studentName,
                totalScore: submission.totalScore,
                totalMarks: exam.totalMarks,
                percentage: ((submission.totalScore / exam.totalMarks) * 100).toFixed(2),
                feedback: JSON.parse(submission.feedback),
                gradedAt: submission.gradedAt
              }, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message })
        }
      ],
      isError: true
    };
  }
});

// Helper functions
function encryptAnswer(answer) {
  // Simple encryption (use proper encryption in production)
  return Buffer.from(answer).toString('base64');
}

function decryptAnswer(encrypted) {
  return Buffer.from(encrypted, 'base64').toString('utf-8');
}

async function gradeSubjectiveAnswer(studentAnswer, correctAnswer, keywords, maxMarks) {
  // Simple keyword-based scoring
  let score = 0;
  const answerLower = studentAnswer.toLowerCase();

  keywords.forEach(keyword => {
    if (answerLower.includes(keyword.toLowerCase())) {
      score += maxMarks / keywords.length;
    }
  });

  // For more advanced grading, integrate with Claude API
  // const aiScore = await useClaudeForGrading(studentAnswer, correctAnswer, maxMarks);

  return Math.min(Math.round(score), maxMarks);
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Exam Grading MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
```

### Step 3: Create package.json for MCP Server

```json
{
  "name": "exam-grading-mcp-server",
  "version": "1.0.0",
  "description": "MCP server for automated exam grading",
  "type": "module",
  "main": "exam-mcp-server.js",
  "bin": {
    "exam-mcp-server": "./exam-mcp-server.js"
  },
  "scripts": {
    "start": "node exam-mcp-server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "mongoose": "^8.0.0",
    "dotenv": "^16.0.0"
  }
}
```

### Step 4: Configure Claude Desktop to Use MCP Server

Create/edit `claude_desktop_config.json`:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "exam-grading": {
      "command": "node",
      "args": [
        "D:\\gentime8\\school management system\\api\\mcp-servers\\exam-server\\exam-mcp-server.js"
      ],
      "env": {
        "MONGODB_URI": "your_mongodb_connection_string"
      }
    }
  }
}
```

---

## Integration with School Management System

### Backend API Routes

Create `api/router/exam.router.js`:

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/auth');

// Teacher creates exam
router.post('/create', authMiddleware(['SCHOOL', 'TEACHER']), async (req, res) => {
  // Call MCP server to create exam
  const examData = req.body;
  // ... implementation
});

// Student gets exam (questions only)
router.get('/:examId/questions', authMiddleware(['STUDENT']), async (req, res) => {
  // Call MCP server to get questions without answers
});

// Student submits exam
router.post('/:examId/submit', authMiddleware(['STUDENT']), async (req, res) => {
  // Call MCP server to submit and grade
});

// Student views results
router.get('/:examId/results', authMiddleware(['STUDENT']), async (req, res) => {
  // Call MCP server to get graded results
});

module.exports = router;
```

### Frontend Components

#### 1. Teacher Exam Creation (`frontend/src/teacher/components/ExamCreator.jsx`)

```javascript
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

export default function ExamCreator() {
  const [exam, setExam] = useState({
    title: '',
    subject: '',
    questions: []
  });

  const addQuestion = () => {
    setExam({
      ...exam,
      questions: [...exam.questions, {
        type: 'short',
        question: '',
        correctAnswer: '',
        marks: 5,
        keywords: []
      }]
    });
  };

  const handleSubmit = async () => {
    const response = await axios.post('/api/exams/create', exam);
    console.log('Exam created:', response.data);
  };

  return (
    <Box>
      <Typography variant="h4">Create Exam</Typography>
      <TextField
        label="Exam Title"
        value={exam.title}
        onChange={(e) => setExam({ ...exam, title: e.target.value })}
        fullWidth
      />
      {/* Add more fields for questions */}
      <Button onClick={addQuestion}>Add Question</Button>
      <Button onClick={handleSubmit}>Create Exam</Button>
    </Box>
  );
}
```

#### 2. Student Exam View (`frontend/src/student/components/ExamTaker.jsx`)

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExamTaker({ examId }) {
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    loadExam();
  }, [examId]);

  const loadExam = async () => {
    const response = await axios.get(`/api/exams/${examId}/questions`);
    setExam(response.data);
  };

  const submitExam = async () => {
    const response = await axios.post(`/api/exams/${examId}/submit`, { answers });
    alert(`Score: ${response.data.totalScore}/${response.data.totalMarks}`);
  };

  if (!exam) return <div>Loading...</div>;

  return (
    <div>
      <h2>{exam.title}</h2>
      {exam.questions.map((q, index) => (
        <div key={q.questionId}>
          <p>{q.question}</p>
          <textarea
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[index] = {
                questionId: q.questionId,
                answer: e.target.value
              };
              setAnswers(newAnswers);
            }}
          />
        </div>
      ))}
      <button onClick={submitExam}>Submit Exam</button>
    </div>
  );
}
```

---

## Security & Best Practices

### 1. **Answer Key Protection**
```javascript
// Encrypt answer keys
const crypto = require('crypto');

function encryptAnswerKey(answerKey, secret) {
  const cipher = crypto.createCipher('aes-256-cbc', secret);
  let encrypted = cipher.update(answerKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
```

### 2. **Prevent Cheating**
- Time limits enforcement
- Randomize question order
- Disable copy-paste
- Monitor tab switching
- Webcam proctoring (optional)

### 3. **Data Privacy**
- Store student answers securely
- GDPR compliance
- Data encryption at rest
- Secure API endpoints

### 4. **Performance**
- Cache exam questions
- Background grading with queues
- Rate limiting
- Database indexing

---

## Cost Comparison

### Free Setup (Self-Hosted)
**Monthly Cost**: ~$0-10
- VPS hosting: $5-10/month
- MongoDB: Free tier
- MCP Server: FREE
- **Total**: ~$10/month

**Pros**: Full control, privacy, customizable
**Cons**: Manual scaling, maintenance

### Paid Setup (Cloud + AI)
**Monthly Cost**: ~$50-500+
- AWS Lambda: $20-100/month
- MongoDB Atlas: $57/month
- Claude API for grading: $50-200/month
- **Total**: $127-357/month

**Pros**: Auto-scaling, managed, advanced AI
**Cons**: Higher costs, vendor lock-in

---

## Advanced Features

### 1. **AI-Powered Essay Grading**
```javascript
import Anthropic from '@anthropic-ai/sdk';

async function gradeEssay(studentEssay, rubric, maxMarks) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Grade this essay out of ${maxMarks} marks based on the rubric:

Rubric: ${rubric}

Student Essay: ${studentEssay}

Provide:
1. Score (out of ${maxMarks})
2. Strengths
3. Areas for improvement`
    }]
  });

  return message.content[0].text;
}
```

### 2. **Plagiarism Detection**
```javascript
async function checkPlagiarism(studentAnswer, submittedAnswers) {
  // Compare with other submissions
  // Use cosine similarity or external API
}
```

### 3. **Analytics Dashboard**
```javascript
// Track:
// - Average scores
// - Question difficulty
// - Time spent per question
// - Student performance trends
```

---

## Getting Started Checklist

- [ ] Install MCP SDK: `npm install @modelcontextprotocol/sdk`
- [ ] Create exam MCP server
- [ ] Configure Claude Desktop
- [ ] Create MongoDB schemas
- [ ] Build teacher exam creator UI
- [ ] Build student exam taker UI
- [ ] Implement auto-grading logic
- [ ] Add security measures
- [ ] Test end-to-end workflow
- [ ] Deploy to production

---

## Resources

- **MCP Documentation**: https://modelcontextprotocol.io
- **MCP SDK**: https://github.com/modelcontextprotocol/sdk
- **Claude API**: https://docs.anthropic.com
- **Example Servers**: https://github.com/modelcontextprotocol/servers

---

## Support

For questions about MCP server implementation:
1. Check MCP documentation
2. Review example servers on GitHub
3. Join Anthropic Discord community
4. Create issue in project repository

---

**Last Updated**: November 1, 2025
**Version**: 1.0.0
**Author**: GenTime Development Team
