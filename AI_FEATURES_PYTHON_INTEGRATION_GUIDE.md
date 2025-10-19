# AI FEATURES WITH PYTHON INTEGRATION GUIDE
## Adding AI/ML Capabilities to School Management System

---

## TABLE OF CONTENTS

1. [Introduction to AI in Education](#1-introduction-to-ai-in-education)
2. [Python Setup with Node.js](#2-python-setup-with-nodejs)
3. [AI Feature Ideas for School Management](#3-ai-feature-ideas-for-school-management)
4. [Student Performance Prediction](#4-student-performance-prediction)
5. [Attendance Pattern Analysis](#5-attendance-pattern-analysis)
6. [Automated Report Card Generation](#6-automated-report-card-generation)
7. [Chatbot for Students/Parents](#7-chatbot-for-studentparents)
8. [Face Recognition Attendance](#8-face-recognition-attendance)
9. [Smart Timetable Generation](#9-smart-timetable-generation)
10. [Exam Difficulty Analyzer](#10-exam-difficulty-analyzer)
11. [Flask API Setup](#11-flask-api-setup)
12. [Node.js + Python Integration](#12-nodejs--python-integration)
13. [Deployment Strategies](#13-deployment-strategies)

---

# 1. INTRODUCTION TO AI IN EDUCATION

## Why Add AI to School Management System?

### Current Manual Processes:
❌ Manual attendance marking
❌ Manual performance analysis
❌ Generic reports
❌ No predictive insights
❌ Time-consuming data entry

### With AI:
✅ Automated attendance (face recognition)
✅ Predict student performance
✅ Personalized learning recommendations
✅ Automated report generation
✅ Smart chatbot for queries
✅ Pattern detection (attendance, grades)

## AI Technologies We'll Use:

| Technology | Purpose | Difficulty |
|------------|---------|------------|
| **scikit-learn** | Predictive models | Easy |
| **TensorFlow/PyTorch** | Deep learning | Medium |
| **OpenCV** | Face recognition | Medium |
| **NLTK/spaCy** | Natural language | Easy |
| **Pandas/NumPy** | Data analysis | Easy |
| **Flask** | Python API | Easy |

---

# 2. PYTHON SETUP WITH NODE.JS

## Install Python

### Windows:
```bash
# Download from python.org
https://www.python.org/downloads/

# Or use Chocolatey
choco install python

# Verify
python --version
pip --version
```

### Ubuntu/Linux:
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Verify
python3 --version
pip3 --version
```

### macOS:
```bash
# Using Homebrew
brew install python3

# Verify
python3 --version
```

## Create Python Virtual Environment

```bash
# Navigate to project
cd "school management system"

# Create python folder
mkdir python-ai
cd python-ai

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Linux/macOS:
source venv/bin/activate

# Install core packages
pip install flask flask-cors
pip install pandas numpy
pip install scikit-learn
pip install tensorflow  # or pytorch
pip install opencv-python
pip install nltk spacy
pip install python-dotenv
pip install pymongo  # for MongoDB connection
```

## Project Structure:

```
school management system/
├── api/                     # Node.js backend
├── frontend/                # React frontend
└── python-ai/               # Python AI services
    ├── venv/                # Virtual environment
    ├── app.py               # Flask API
    ├── models/              # AI models
    │   ├── performance_predictor.py
    │   ├── attendance_analyzer.py
    │   └── face_recognition.py
    ├── data/                # Training data
    ├── trained_models/      # Saved models
    ├── utils/               # Helper functions
    └── requirements.txt     # Python dependencies
```

## Create requirements.txt:

```txt
Flask==2.3.0
flask-cors==4.0.0
pandas==2.0.0
numpy==1.24.0
scikit-learn==1.3.0
tensorflow==2.13.0
opencv-python==4.8.0
nltk==3.8.0
spacy==3.6.0
python-dotenv==1.0.0
pymongo==4.5.0
requests==2.31.0
```

Install all at once:
```bash
pip install -r requirements.txt
```

---

# 3. AI FEATURE IDEAS FOR SCHOOL MANAGEMENT

## 1. Student Performance Prediction
**What:** Predict future exam scores based on past performance, attendance, assignments
**Tech:** scikit-learn (Linear Regression, Random Forest)
**Benefit:** Early intervention for struggling students

## 2. Attendance Pattern Analysis
**What:** Detect unusual attendance patterns, predict dropouts
**Tech:** Pandas, scikit-learn (Clustering, Anomaly Detection)
**Benefit:** Identify at-risk students

## 3. Automated Report Generation
**What:** Generate narrative reports from data
**Tech:** NLP (GPT, Custom templates)
**Benefit:** Save teachers hours of work

## 4. Intelligent Chatbot
**What:** Answer student/parent queries (fees, schedule, etc.)
**Tech:** NLP, Intent Recognition
**Benefit:** 24/7 instant support

## 5. Face Recognition Attendance
**What:** Auto-mark attendance via camera
**Tech:** OpenCV, Face Recognition
**Benefit:** No manual marking, fraud prevention

## 6. Smart Timetable Generator
**What:** AI-optimized class scheduling
**Tech:** Constraint Satisfaction, Genetic Algorithms
**Benefit:** Optimal teacher/room allocation

## 7. Plagiarism Detector
**What:** Detect copied assignments
**Tech:** NLP, Similarity matching
**Benefit:** Academic integrity

## 8. Learning Style Recommender
**What:** Recommend study materials based on learning patterns
**Tech:** Collaborative Filtering
**Benefit:** Personalized learning

## 9. Exam Difficulty Analyzer
**What:** Analyze and balance exam difficulty
**Tech:** Statistical Analysis
**Benefit:** Fair assessments

## 10. Fee Payment Prediction
**What:** Predict payment delays
**Tech:** Classification models
**Benefit:** Better cash flow management

---

# 4. STUDENT PERFORMANCE PREDICTION

## Goal:
Predict student's next exam score based on:
- Previous exam scores
- Attendance percentage
- Assignment submissions
- Class participation

## Step 1: Prepare Data

**File:** `python-ai/data/prepare_student_data.py`

```python
import pymongo
import pandas as pd
from datetime import datetime

# Connect to MongoDB
client = pymongo.MongoClient("mongodb+srv://...")
db = client['school_management']

def fetch_student_data():
    """Fetch student data from MongoDB"""

    students = list(db.students.find({}))
    attendance = list(db.attendance.find({}))
    examinations = list(db.examinations.find({}))

    # Create DataFrame
    data = []

    for student in students:
        student_id = str(student['_id'])

        # Calculate attendance percentage
        total_days = len([a for a in attendance if str(a['student']) == student_id])
        present_days = len([a for a in attendance
                           if str(a['student']) == student_id and a['status'] == 'Present'])
        attendance_pct = (present_days / total_days * 100) if total_days > 0 else 0

        # Get exam scores (assuming we have marks in marksheets)
        # This is simplified - you'd fetch from your marksheet collection
        exam_scores = [75, 82, 78, 85]  # Example historical scores

        if len(exam_scores) >= 3:
            data.append({
                'student_id': student_id,
                'name': student['name'],
                'attendance_pct': attendance_pct,
                'prev_score_1': exam_scores[-3],
                'prev_score_2': exam_scores[-2],
                'prev_score_3': exam_scores[-1],
                'avg_score': sum(exam_scores[-3:]) / 3,
                'next_score': 88  # Actual next score (for training)
            })

    df = pd.DataFrame(data)
    df.to_csv('data/student_performance.csv', index=False)
    return df

if __name__ == '__main__':
    df = fetch_student_data()
    print(df.head())
```

## Step 2: Train Model

**File:** `python-ai/models/performance_predictor.py`

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

class PerformancePredictor:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )

    def train(self, data_path='data/student_performance.csv'):
        """Train the model"""

        # Load data
        df = pd.read_csv(data_path)

        # Features
        features = ['attendance_pct', 'prev_score_1', 'prev_score_2', 'prev_score_3', 'avg_score']
        X = df[features]
        y = df['next_score']

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Train model
        self.model.fit(X_train, y_train)

        # Evaluate
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        print(f"Model Performance:")
        print(f"Mean Absolute Error: {mae:.2f}")
        print(f"R² Score: {r2:.2f}")

        # Save model
        joblib.dump(self.model, 'trained_models/performance_predictor.pkl')
        print("Model saved!")

    def load_model(self):
        """Load trained model"""
        self.model = joblib.load('trained_models/performance_predictor.pkl')

    def predict(self, attendance_pct, prev_scores):
        """
        Predict next exam score

        Args:
            attendance_pct: float (0-100)
            prev_scores: list of last 3 scores
        """
        features = [
            attendance_pct,
            prev_scores[0],
            prev_scores[1],
            prev_scores[2],
            np.mean(prev_scores)
        ]

        prediction = self.model.predict([features])[0]
        return round(prediction, 2)

    def get_recommendation(self, predicted_score, current_avg):
        """Generate recommendation"""
        if predicted_score < 40:
            risk = "High Risk"
            action = "Immediate intervention needed. Schedule parent meeting."
        elif predicted_score < 60:
            risk = "Medium Risk"
            action = "Extra coaching recommended. Monitor closely."
        elif predicted_score < current_avg - 5:
            risk = "Declining"
            action = "Student showing decline. Investigate causes."
        else:
            risk = "On Track"
            action = "Continue current performance."

        return {
            'predicted_score': predicted_score,
            'risk_level': risk,
            'recommendation': action
        }

if __name__ == '__main__':
    predictor = PerformancePredictor()
    predictor.train()

    # Test prediction
    result = predictor.predict(
        attendance_pct=85,
        prev_scores=[75, 80, 78]
    )
    print(f"\nPredicted next score: {result}")
```

## Step 3: Flask API

**File:** `python-ai/app.py`

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from models.performance_predictor import PerformancePredictor
import os

app = Flask(__name__)
CORS(app)  # Allow requests from Node.js/React

# Load model on startup
predictor = PerformancePredictor()
if os.path.exists('trained_models/performance_predictor.pkl'):
    predictor.load_model()
    print("✅ Performance prediction model loaded")

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'ok', 'service': 'AI API'})

@app.route('/api/predict-performance', methods=['POST'])
def predict_performance():
    """
    Predict student performance

    Request:
    {
        "attendance_pct": 85,
        "prev_scores": [75, 80, 78]
    }
    """
    try:
        data = request.json

        attendance_pct = data.get('attendance_pct')
        prev_scores = data.get('prev_scores')

        if not attendance_pct or not prev_scores or len(prev_scores) != 3:
            return jsonify({'error': 'Invalid input'}), 400

        # Predict
        predicted_score = predictor.predict(attendance_pct, prev_scores)

        # Get recommendation
        current_avg = sum(prev_scores) / len(prev_scores)
        recommendation = predictor.get_recommendation(predicted_score, current_avg)

        return jsonify({
            'success': True,
            'prediction': recommendation
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
```

## Step 4: Call from Node.js

**File:** `api/controller/ai.controller.js`

```javascript
const axios = require('axios');

const AI_API_URL = process.env.AI_API_URL || 'http://localhost:5001';

const predictStudentPerformance = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Fetch student data from MongoDB
        const student = await Student.findById(studentId);
        const attendance = await Attendance.find({ student: studentId });

        // Calculate attendance percentage
        const totalDays = attendance.length;
        const presentDays = attendance.filter(a => a.status === 'Present').length;
        const attendancePct = (presentDays / totalDays) * 100;

        // Get previous scores (fetch from marksheets)
        const marksheets = await Marksheet.find({ student: studentId })
            .sort({ createdAt: -1 })
            .limit(3);

        const prevScores = marksheets.map(m => m.percentage);

        if (prevScores.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Not enough data for prediction'
            });
        }

        // Call Python AI API
        const prediction = await axios.post(`${AI_API_URL}/api/predict-performance`, {
            attendance_pct: attendancePct,
            prev_scores: prevScores
        });

        res.status(200).json({
            success: true,
            data: {
                student: {
                    id: student._id,
                    name: student.name
                },
                attendance_pct: attendancePct,
                previous_scores: prevScores,
                prediction: prediction.data.prediction
            }
        });

    } catch (error) {
        console.log('AI Prediction Error:', error);
        res.status(500).json({
            success: false,
            message: 'Prediction failed'
        });
    }
};

module.exports = { predictStudentPerformance };
```

## Step 5: Add Route

**File:** `api/router/ai.router.js`

```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { predictStudentPerformance } = require('../controller/ai.controller');

router.get('/predict-performance/:studentId',
    authMiddleware(['SCHOOL', 'TEACHER']),
    predictStudentPerformance
);

module.exports = router;
```

**In server.js:**
```javascript
const aiRouter = require('./router/ai.router');
app.use('/api/ai', aiRouter);
```

## Step 6: Frontend Integration

```javascript
// In React component
const StudentPerformancePrediction = ({ studentId }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPrediction = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/ai/predict-performance/${studentId}`);
            setPrediction(response.data.data);
        } catch (error) {
            console.error('Prediction error:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPrediction();
    }, [studentId]);

    if (loading) return <CircularProgress />;
    if (!prediction) return null;

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">AI Performance Prediction</Typography>

                <Box mt={2}>
                    <Typography>Predicted Next Score: <strong>{prediction.prediction.predicted_score}</strong></Typography>
                    <Typography>Risk Level: <Chip label={prediction.prediction.risk_level} color={
                        prediction.prediction.risk_level === 'High Risk' ? 'error' :
                        prediction.prediction.risk_level === 'Medium Risk' ? 'warning' : 'success'
                    } /></Typography>
                    <Typography mt={1}>Recommendation:</Typography>
                    <Alert severity="info">{prediction.prediction.recommendation}</Alert>
                </Box>

                <Box mt={2}>
                    <Typography variant="caption">Based on:</Typography>
                    <Typography>Attendance: {prediction.attendance_pct.toFixed(1)}%</Typography>
                    <Typography>Previous Scores: {prediction.previous_scores.join(', ')}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};
```

---

# 5. ATTENDANCE PATTERN ANALYSIS

## Detect Unusual Patterns

**File:** `python-ai/models/attendance_analyzer.py`

```python
import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN
from datetime import datetime, timedelta

class AttendanceAnalyzer:

    def analyze_patterns(self, student_id, attendance_data):
        """
        Analyze attendance patterns

        Returns:
        - Consecutive absences
        - Weekly patterns
        - Anomalies
        - Dropout risk
        """

        df = pd.DataFrame(attendance_data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')

        # 1. Consecutive absences
        consecutive_absences = self._find_consecutive_absences(df)

        # 2. Weekly pattern
        df['day_of_week'] = df['date'].dt.dayofweek
        weekly_pattern = df.groupby('day_of_week')['status'].apply(
            lambda x: (x == 'Present').sum() / len(x)
        ).to_dict()

        # 3. Monthly attendance rate
        df['month'] = df['date'].dt.to_period('M')
        monthly_rate = df.groupby('month')['status'].apply(
            lambda x: (x == 'Present').sum() / len(x) * 100
        ).to_dict()

        # 4. Dropout risk score
        recent_30_days = df[df['date'] >= datetime.now() - timedelta(days=30)]
        if len(recent_30_days) > 0:
            recent_attendance_rate = (recent_30_days['status'] == 'Present').sum() / len(recent_30_days)
        else:
            recent_attendance_rate = 1

        dropout_risk = self._calculate_dropout_risk(
            recent_attendance_rate,
            consecutive_absences
        )

        return {
            'consecutive_absences': consecutive_absences,
            'weekly_pattern': {k: round(v * 100, 2) for k, v in weekly_pattern.items()},
            'monthly_attendance': {str(k): round(v, 2) for k, v in monthly_rate.items()},
            'recent_30_day_rate': round(recent_attendance_rate * 100, 2),
            'dropout_risk': dropout_risk
        }

    def _find_consecutive_absences(self, df):
        """Find longest streak of consecutive absences"""
        max_streak = 0
        current_streak = 0

        for status in df['status']:
            if status == 'Absent':
                current_streak += 1
                max_streak = max(max_streak, current_streak)
            else:
                current_streak = 0

        return max_streak

    def _calculate_dropout_risk(self, attendance_rate, consecutive_absences):
        """Calculate dropout risk (0-100)"""

        risk_score = 0

        # Low attendance
        if attendance_rate < 0.5:
            risk_score += 50
        elif attendance_rate < 0.7:
            risk_score += 30
        elif attendance_rate < 0.85:
            risk_score += 15

        # Consecutive absences
        if consecutive_absences >= 10:
            risk_score += 30
        elif consecutive_absences >= 5:
            risk_score += 20
        elif consecutive_absences >= 3:
            risk_score += 10

        if risk_score >= 70:
            level = "Critical"
        elif risk_score >= 40:
            level = "High"
        elif risk_score >= 20:
            level = "Medium"
        else:
            level = "Low"

        return {
            'score': min(risk_score, 100),
            'level': level
        }

# Flask endpoint
@app.route('/api/analyze-attendance/<student_id>', methods=['GET'])
def analyze_attendance(student_id):
    try:
        # Fetch from MongoDB
        attendance = list(db.attendance.find({'student': ObjectId(student_id)}))

        attendance_data = [{
            'date': a['date'],
            'status': a['status']
        } for a in attendance]

        analyzer = AttendanceAnalyzer()
        analysis = analyzer.analyze_patterns(student_id, attendance_data)

        return jsonify({'success': True, 'analysis': analysis})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

---

# 6. AUTOMATED REPORT CARD GENERATION

## Generate Narrative Reports

**File:** `python-ai/models/report_generator.py`

```python
class ReportGenerator:

    def generate_narrative(self, student_data):
        """
        Generate narrative report card

        Input:
        {
            'name': 'John Doe',
            'attendance_pct': 92,
            'subjects': [
                {'name': 'Math', 'score': 85, 'total': 100},
                {'name': 'Science', 'score': 78, 'total': 100}
            ],
            'overall_grade': 'A',
            'rank': 5,
            'total_students': 50
        }
        """

        name = student_data['name']
        attendance = student_data['attendance_pct']
        subjects = student_data['subjects']
        grade = student_data['overall_grade']
        rank = student_data['rank']
        total = student_data['total_students']

        # Calculate averages
        scores = [s['score'] for s in subjects]
        avg_score = sum(scores) / len(scores)

        # Strengths and weaknesses
        strengths = [s for s in subjects if s['score'] >= 80]
        weaknesses = [s for s in subjects if s['score'] < 60]

        # Generate narrative
        report = f"""
        **Student Performance Report**

        **Name:** {name}
        **Overall Grade:** {grade}
        **Class Rank:** {rank} out of {total} students

        **Academic Performance:**
        {name} has demonstrated {'excellent' if avg_score >= 85 else 'good' if avg_score >= 70 else 'satisfactory'} academic performance this term, achieving an average score of {avg_score:.1f}%.

        """

        if strengths:
            report += f"\n**Strengths:**\n"
            report += f"{name} shows exceptional aptitude in {', '.join([s['name'] for s in strengths])}, "
            report += f"scoring above 80% in these subjects. This demonstrates strong understanding and consistent effort.\n"

        if weaknesses:
            report += f"\n**Areas for Improvement:**\n"
            report += f"Additional focus is needed in {', '.join([s['name'] for s in weaknesses])}. "
            report += f"We recommend extra coaching or tutoring in these subjects.\n"

        report += f"\n**Attendance:**\n"
        if attendance >= 90:
            report += f"Excellent attendance record of {attendance}%. {name} is regular and punctual."
        elif attendance >= 75:
            report += f"Good attendance of {attendance}%. Maintain consistency."
        else:
            report += f"Attendance of {attendance}% is concerning. Improvement is necessary."

        report += f"\n\n**Teacher's Remarks:**\n"
        if avg_score >= 85 and attendance >= 90:
            report += f"{name} is an exemplary student. Keep up the excellent work!"
        elif avg_score >= 70:
            report += f"{name} is performing well. With focused effort, can achieve even better results."
        else:
            report += f"{name} has potential. More dedication and regular study needed."

        return report

# Flask endpoint
@app.route('/api/generate-report/<student_id>', methods=['GET'])
def generate_report(student_id):
    try:
        # Fetch student data
        student = db.students.find_one({'_id': ObjectId(student_id)})
        marksheet = db.marksheets.find_one({'student': ObjectId(student_id)})

        student_data = {
            'name': student['name'],
            'attendance_pct': 92,  # Calculate from attendance collection
            'subjects': marksheet['subjects'],
            'overall_grade': marksheet['grade'],
            'rank': marksheet.get('rank', 0),
            'total_students': 50  # Get from class
        }

        generator = ReportGenerator()
        report = generator.generate_narrative(student_data)

        return jsonify({'success': True, 'report': report})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

---

# 7. CHATBOT FOR STUDENTS/PARENTS

## Simple Q&A Chatbot

**File:** `python-ai/models/chatbot.py`

```python
import re
from datetime import datetime

class SchoolChatbot:

    def __init__(self, db_connection):
        self.db = db_connection

        # Intent patterns
        self.intents = {
            'fees': [
                r'.*fee.*',
                r'.*payment.*',
                r'.*pay.*',
                r'.*balance.*'
            ],
            'attendance': [
                r'.*attendance.*',
                r'.*present.*',
                r'.*absent.*'
            ],
            'exam': [
                r'.*exam.*',
                r'.*test.*',
                r'.*marks.*',
                r'.*score.*'
            ],
            'schedule': [
                r'.*schedule.*',
                r'.*timetable.*',
                r'.*class.*timing.*'
            ],
            'greeting': [
                r'.*hello.*',
                r'.*hi.*',
                r'.*hey.*'
            ]
        }

    def get_intent(self, message):
        """Detect user intent"""
        message = message.lower()

        for intent, patterns in self.intents.items():
            for pattern in patterns:
                if re.match(pattern, message):
                    return intent

        return 'unknown'

    def handle_message(self, message, student_id):
        """Process message and generate response"""

        intent = self.get_intent(message)

        if intent == 'greeting':
            return self._greeting_response()

        elif intent == 'fees':
            return self._fees_response(student_id)

        elif intent == 'attendance':
            return self._attendance_response(student_id)

        elif intent == 'exam':
            return self._exam_response(student_id)

        elif intent == 'schedule':
            return self._schedule_response(student_id)

        else:
            return self._default_response()

    def _greeting_response(self):
        return {
            'message': "Hello! I'm your school assistant. How can I help you today?\n\n" +
                      "I can help with:\n" +
                      "- Fee information\n" +
                      "- Attendance records\n" +
                      "- Exam schedules\n" +
                      "- Class timetable"
        }

    def _fees_response(self, student_id):
        student = self.db.students.find_one({'_id': ObjectId(student_id)})

        if student and 'fees' in student:
            total = student['fees']['total_fees']
            paid = student['fees']['paid_fees']
            balance = student['fees']['balance_fees']

            return {
                'message': f"**Fee Information:**\n\n" +
                          f"Total Fees: ₹{total}\n" +
                          f"Paid: ₹{paid}\n" +
                          f"Balance: ₹{balance}\n\n" +
                          f"{'✅ Fees fully paid!' if balance == 0 else '⚠️ Payment pending!'}"
            }
        return {'message': "Unable to fetch fee information."}

    def _attendance_response(self, student_id):
        attendance = list(self.db.attendance.find({'student': ObjectId(student_id)}))

        total_days = len(attendance)
        present_days = len([a for a in attendance if a['status'] == 'Present'])
        percentage = (present_days / total_days * 100) if total_days > 0 else 0

        # Last 7 days
        recent = attendance[-7:]
        recent_status = [a['status'] for a in recent]

        return {
            'message': f"**Attendance Summary:**\n\n" +
                      f"Total Days: {total_days}\n" +
                      f"Present: {present_days}\n" +
                      f"Attendance: {percentage:.1f}%\n\n" +
                      f"Last 7 days: {', '.join(recent_status)}"
        }

    def _exam_response(self, student_id):
        student = self.db.students.find_one({'_id': ObjectId(student_id)})
        class_id = student['student_class']

        upcoming_exams = list(self.db.examinations.find({
            'class': class_id,
            'status': 'pending',
            'examDate': {'$gte': datetime.now().strftime('%Y-%m-%d')}
        }).limit(5))

        if upcoming_exams:
            message = "**Upcoming Exams:**\n\n"
            for exam in upcoming_exams:
                subject = self.db.subjects.find_one({'_id': exam['subject']})
                message += f"- {subject['subject_name']}: {exam['examDate']} ({exam['examType']})\n"
        else:
            message = "No upcoming exams scheduled."

        return {'message': message}

    def _schedule_response(self, student_id):
        # Fetch today's schedule
        student = self.db.students.find_one({'_id': ObjectId(student_id)})
        class_id = student['student_class']

        today = datetime.now()
        periods = list(self.db.periods.find({
            'class': class_id,
            'startTime': {
                '$gte': today.replace(hour=0, minute=0),
                '$lt': today.replace(hour=23, minute=59)
            }
        }).sort('startTime', 1))

        if periods:
            message = f"**Today's Schedule ({today.strftime('%A')}):**\n\n"
            for period in periods:
                subject = self.db.subjects.find_one({'_id': period['subject']})
                start = period['startTime'].strftime('%I:%M %p')
                end = period['endTime'].strftime('%I:%M %p')
                message += f"{start} - {end}: {subject['subject_name']}\n"
        else:
            message = "No classes scheduled for today."

        return {'message': message}

    def _default_response(self):
        return {
            'message': "I'm not sure I understand. Try asking about fees, attendance, exams, or schedule."
        }

# Flask endpoint
@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.json
        message = data.get('message')
        student_id = data.get('student_id')

        bot = SchoolChatbot(db)
        response = bot.handle_message(message, student_id)

        return jsonify({'success': True, 'response': response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

**Frontend Usage:**

```javascript
const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);

        const response = await axios.post('http://localhost:5001/api/chatbot', {
            message: input,
            student_id: userId
        });

        const botMessage = {
            sender: 'bot',
            text: response.data.response.message
        };
        setMessages([...messages, userMessage, botMessage]);
        setInput('');
    };

    return (
        <Box>
            <Paper sx={{ height: 400, overflow: 'auto', p: 2 }}>
                {messages.map((msg, i) => (
                    <Box key={i} sx={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                        <Chip label={msg.text} color={msg.sender === 'user' ? 'primary' : 'default'} />
                    </Box>
                ))}
            </Paper>
            <TextField
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
            />
        </Box>
    );
};
```

---

*Due to length, the remaining sections (Face Recognition, Smart Timetable, etc.) follow similar patterns. The complete guide would continue with detailed implementation for each feature.*

---

## Summary

✅ Python environment setup
✅ Flask API creation
✅ Student performance prediction with ML
✅ Attendance pattern analysis
✅ Automated report generation
✅ Chatbot implementation
✅ Node.js + Python integration
✅ Frontend examples

**Next Steps:**
1. Set up Python environment
2. Train models with your data
3. Deploy Flask API
4. Integrate with Node.js backend
5. Add UI components in React

**Total AI Features Possible:**
- Performance Prediction
- Attendance Analysis
- Report Generation
- Chatbot
- Face Recognition (see OpenCV docs)
- Timetable Optimization
- Plagiarism Detection
- Learning Recommendations

---

**End of AI Features Guide**
