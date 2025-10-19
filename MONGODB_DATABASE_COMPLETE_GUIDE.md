# MONGODB DATABASE COMPLETE GUIDE
## School Management System - Database Architecture

---

## TABLE OF CONTENTS

1. [MongoDB Fundamentals](#1-mongodb-fundamentals)
2. [MongoDB vs SQL Comparison](#2-mongodb-vs-sql-comparison)
3. [Mongoose ODM](#3-mongoose-odm)
4. [Schema Definitions](#4-schema-definitions)
5. [All Database Models Explained](#5-all-database-models-explained)
6. [Relationships & Population](#6-relationships--population)
7. [Indexes & Performance](#7-indexes--performance)
8. [Validation Rules](#8-validation-rules)
9. [Middleware (Pre/Post Hooks)](#9-middleware-prepost-hooks)
10. [Query Methods](#10-query-methods)
11. [Database Connection](#11-database-connection)

---

# 1. MONGODB FUNDAMENTALS

## What is MongoDB?

**MongoDB** is a NoSQL, document-oriented database that stores data in JSON-like documents (BSON - Binary JSON).

### Key Concepts:

```
SQL Database     →  MongoDB
================    ================
Database        →  Database
Table           →  Collection
Row             →  Document
Column          →  Field
Index           →  Index
Join            →  Embedded Document or Reference
```

### Document Example:

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "age": 18,
  "class": "10th",
  "subjects": ["Math", "Science", "English"],
  "address": {
    "street": "123 Main St",
    "city": "Mumbai"
  },
  "createdAt": ISODate("2025-10-01T00:00:00Z")
}
```

### BSON Data Types:

- **String**: `"John Doe"`
- **Number**: `18`, `99.5`
- **Boolean**: `true`, `false`
- **Date**: `ISODate("2025-10-01")`
- **ObjectId**: `ObjectId("507f1f77bcf86cd799439011")`
- **Array**: `["Math", "Science"]`
- **Object** (Embedded Document): `{ street: "...", city: "..." }`
- **Null**: `null`

## Why NoSQL?

**Advantages:**
- Flexible schema (no predefined structure)
- Horizontal scaling (sharding)
- Fast for read-heavy operations
- Natural fit for JSON data
- Embedded documents reduce joins

**Disadvantages:**
- No ACID transactions across documents (though MongoDB 4+ supports multi-document transactions)
- Data duplication
- Complex joins are harder

---

# 2. MONGODB VS SQL COMPARISON

## Detailed Comparison Table:

| Feature | SQL (MySQL/PostgreSQL) | MongoDB |
|---------|----------------------|---------|
| **Data Model** | Tables with rows & columns | Collections with documents |
| **Schema** | Fixed, predefined | Flexible, dynamic |
| **Relationships** | Foreign keys, JOINs | References or embedded docs |
| **Transactions** | Full ACID support | Single-document ACID, multi-doc transactions available |
| **Scaling** | Vertical (bigger server) | Horizontal (more servers) |
| **Query Language** | SQL | MongoDB Query Language (MQL) |
| **Best For** | Complex transactions, reporting | Rapid development, flexible data |

## Example Comparison:

### SQL (Student Table):

```sql
-- Create Table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    age INT,
    email VARCHAR(255) UNIQUE,
    class_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Insert
INSERT INTO students (name, age, email, class_id)
VALUES ('John Doe', 18, 'john@school.com', 5);

-- Query
SELECT students.name, students.age, classes.class_name
FROM students
JOIN classes ON students.class_id = classes.id
WHERE students.age >= 18;

-- Update
UPDATE students
SET age = 19
WHERE id = 1;

-- Delete
DELETE FROM students WHERE id = 1;
```

### MongoDB (Student Collection):

```javascript
// Schema (with Mongoose)
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    email: { type: String, unique: true },
    student_class: { type: mongoose.Schema.ObjectId, ref: 'Class' },
    createdAt: { type: Date, default: Date.now }
});

// Insert
await Student.create({
    name: 'John Doe',
    age: 18,
    email: 'john@school.com',
    student_class: classObjectId
});

// Query with Population (similar to JOIN)
const students = await Student.find({ age: { $gte: 18 } })
    .populate('student_class');

// Update
await Student.findByIdAndUpdate(studentId, { age: 19 });

// Delete
await Student.findByIdAndDelete(studentId);
```

## When to Use SQL vs MongoDB:

### Use SQL When:
- Complex relationships (many-to-many)
- Strict data consistency required
- Financial transactions
- Reporting with complex aggregations
- Schema is stable

### Use MongoDB When:
- Rapid development
- Flexible/evolving schema
- Document-based data (JSON)
- Horizontal scaling needed
- Read-heavy workloads
- Content management systems

---

# 3. MONGOOSE ODM

## What is ODM?

**ODM (Object Document Mapper)** is like ORM for NoSQL databases. Mongoose provides:
- Schema definition
- Validation
- Query building
- Middleware
- Type casting
- Default values

## Mongoose Setup:

```javascript
// 1. Install
// npm install mongoose

// 2. Import
const mongoose = require('mongoose');

// 3. Connect to MongoDB
mongoose.connect('mongodb+srv://username:password@cluster.mongodb.net/database')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('Error:', err));

// 4. Define Schema
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number
});

// 5. Create Model
const Student = mongoose.model('Student', studentSchema);

// 6. Use Model
const newStudent = new Student({
    name: 'John',
    age: 18
});

await newStudent.save();
```

## Mongoose Schema Types:

```javascript
const schema = new mongoose.Schema({
    // Basic Types
    name: String,
    age: Number,
    isActive: Boolean,
    createdAt: Date,

    // ObjectId (Reference)
    school: mongoose.Schema.ObjectId,
    // OR
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },

    // Array
    subjects: [String],
    grades: [Number],

    // Embedded Document
    address: {
        street: String,
        city: String,
        pincode: String
    },

    // Array of References
    courses: [{ type: mongoose.Schema.ObjectId, ref: 'Course' }],

    // Array of Embedded Documents
    fees_history: [{
        amount: Number,
        date: Date,
        method: String
    }],

    // Mixed (Any type)
    metadata: mongoose.Schema.Types.Mixed,

    // Buffer (Binary data)
    file: Buffer
});
```

---

# 4. SCHEMA DEFINITIONS

## Schema Options:

```javascript
const schema = new mongoose.Schema({
    name: {
        type: String,           // Data type
        required: true,         // Validation: field is mandatory
        unique: true,           // Creates unique index
        trim: true,             // Remove whitespace
        lowercase: true,        // Convert to lowercase
        uppercase: true,        // Convert to uppercase
        minlength: 3,          // Minimum string length
        maxlength: 50,         // Maximum string length
        match: /^[a-zA-Z]+$/,  // Regex validation
        enum: ['A', 'B', 'C'], // Allow only these values
        default: 'Unknown',     // Default value
        validate: {             // Custom validation
            validator: function(v) {
                return v.length > 0;
            },
            message: 'Name cannot be empty'
        }
    },
    age: {
        type: Number,
        min: 0,                // Minimum value
        max: 120,              // Maximum value
        required: false
    }
}, {
    timestamps: true,          // Adds createdAt & updatedAt
    collection: 'students'     // Collection name (default: lowercase plural)
});
```

## Virtuals:

Virtuals are document properties that are not stored in MongoDB but computed on the fly.

```javascript
// Define virtual
courseSchema.virtual('isFull').get(function() {
    return this.currentEnrollment >= this.maxStudents;
});

// Use virtual
const course = await Course.findById(courseId);
if (course.isFull) {
    console.log('Course is full!');
}

// Note: Virtuals are NOT included in JSON by default
// To include them:
schema.set('toJSON', { virtuals: true });
schema.set('toObject', { virtuals: true });
```

---

# 5. ALL DATABASE MODELS EXPLAINED

## 5.1 School Model

**File:** `api/model/school.model.js`

```javascript
const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
    school_name: { type: String, required: true },
    email: { type: String, required: true },
    owner_name: { type: String, required: true },
    school_image: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    password: { type: String, required: true }
});

module.exports = mongoose.model("School", schoolSchema);
```

### Field Explanations:

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `school_name` | String | Name of the school | Yes |
| `email` | String | School admin email (login) | Yes |
| `owner_name` | String | School owner/admin name | Yes |
| `school_image` | String | Filename of school logo | Yes |
| `createdAt` | Date | Registration timestamp | Auto |
| `password` | String | Hashed password (bcrypt) | Yes |

### Sample Document:

```json
{
  "_id": ObjectId("68cc82457107f80c1bbcb940"),
  "school_name": "Test School",
  "email": "test@school.com",
  "owner_name": "Test Owner",
  "school_image": "school_logo.jpg",
  "createdAt": ISODate("2025-10-01T00:00:00Z"),
  "password": "$2a$10$encrypted_hash_here"
}
```

### Relationships:
- **One-to-Many** with Students (One school has many students)
- **One-to-Many** with Teachers
- **One-to-Many** with Classes
- **One-to-Many** with all other entities

---

## 5.2 Student Model

**File:** `api/model/student.model.js`

```javascript
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School' },
    email: { type: String, required: true },
    name: { type: String, required: true },
    student_class: { type: mongoose.Schema.ObjectId, ref: "Class" },
    course: { type: mongoose.Schema.ObjectId, ref: "Course" },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    guardian: { type: String, required: true },
    guardian_phone: { type: String, required: true },
    aadhaar_number: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhaar number must be exactly 12 digits'
        },
        unique: false,
        sparse: true
    },
    student_image: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    fees: {
        total_fees: { type: Number, default: 0 },
        paid_fees: { type: Number, default: 0 },
        balance_fees: { type: Number, default: 0 }
    },
    password: { type: String, required: true }
});

// Pre-save middleware to calculate balance fees
studentSchema.pre('save', function(next) {
    if (this.fees) {
        this.fees.balance_fees =
            (this.fees.total_fees || 0) - (this.fees.paid_fees || 0);
    }
    next();
});

module.exports = mongoose.model("Student", studentSchema);
```

### Field Explanations:

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `school` | ObjectId | Reference to School | Yes |
| `email` | String | Student login email | Yes |
| `name` | String | Student full name | Yes |
| `student_class` | ObjectId | Reference to Class | Yes |
| `course` | ObjectId | Reference to Course | No |
| `age` | String | Student age | Yes |
| `gender` | String | Male/Female/Other | Yes |
| `guardian` | String | Parent/Guardian name | Yes |
| `guardian_phone` | String | Contact number | Yes |
| `aadhaar_number` | String | 12-digit Aadhaar ID | No |
| `student_image` | String | Profile photo filename | Yes |
| `fees.total_fees` | Number | Total fees amount | Auto (0) |
| `fees.paid_fees` | Number | Amount paid | Auto (0) |
| `fees.balance_fees` | Number | Balance (calculated) | Auto |
| `password` | String | Hashed password | Yes |

### Validation Details:

**Aadhaar Number Validation:**
```javascript
validate: {
    validator: function(v) {
        if (!v) return true;  // Allow empty
        return /^\d{12}$/.test(v);  // Must be 12 digits
    },
    message: 'Aadhaar number must be exactly 12 digits'
}
```

**Sparse Index:**
```javascript
unique: false,
sparse: true
```
- `sparse: true` means the index only includes documents that have the field
- Allows multiple students without aadhaar_number

### Pre-save Middleware:

```javascript
studentSchema.pre('save', function(next) {
    if (this.fees) {
        this.fees.balance_fees =
            (this.fees.total_fees || 0) - (this.fees.paid_fees || 0);
    }
    next();
});
```

**What it does:**
- Runs automatically before saving document
- Calculates balance_fees = total_fees - paid_fees
- Ensures data consistency

---

## 5.3 Teacher Model

**File:** `api/model/teacher.model.js`

```javascript
const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School' },
    email: { type: String, required: true },
    name: { type: String, required: true },
    qualification: { type: String, required: false },
    age: { type: String, required: false },
    gender: { type: String, required: true },
    teacher_image: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    password: { type: String, required: true }
});

module.exports = mongoose.model("Teacher", teacherSchema);
```

### Field Explanations:

| Field | Type | Purpose |
|-------|------|---------|
| `school` | ObjectId | Reference to School |
| `email` | String | Teacher login email |
| `name` | String | Teacher full name |
| `qualification` | String | Education (B.Ed, M.Sc, etc.) |
| `age` | String | Teacher age |
| `gender` | String | Male/Female/Other |
| `teacher_image` | String | Profile photo |
| `password` | String | Hashed password |

### Relationships:
- **Belongs to** School
- **Many-to-Many** with Classes (via Class.asignSubTeach)
- **Many-to-Many** with Subjects (via Class.asignSubTeach)
- **One-to-Many** with Periods

---

## 5.4 Class Model

**File:** `api/model/class.model.js`

```javascript
const mongoose = require("mongoose");

const asignSubTeachSchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.ObjectId, ref: 'Subject' },
    teacher: { type: mongoose.Schema.ObjectId, ref: "Teacher" }
});

const classSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School' },
    class_text: { type: String, required: true },
    class_num: { type: Number, required: true },
    asignSubTeach: [asignSubTeachSchema],
    attendee: { type: mongoose.Schema.ObjectId, ref: 'Teacher', required: false },
    createdAt: { type: Date, default: new Date() }
});

module.exports = mongoose.model("Class", classSchema);
```

### Field Explanations:

| Field | Type | Purpose |
|-------|------|---------|
| `school` | ObjectId | Reference to School |
| `class_text` | String | Display name ("10th Standard") |
| `class_num` | Number | Numeric value (10) |
| `asignSubTeach` | Array | Subject-Teacher assignments |
| `attendee` | ObjectId | Class teacher/attendance taker |

### Embedded Document: asignSubTeach

This is an **array of embedded documents** that stores which teacher teaches which subject in this class.

```javascript
{
  "_id": ObjectId("class123"),
  "class_text": "10th Standard",
  "class_num": 10,
  "asignSubTeach": [
    {
      "subject": ObjectId("math_subject_id"),
      "teacher": ObjectId("teacher1_id")
    },
    {
      "subject": ObjectId("science_subject_id"),
      "teacher": ObjectId("teacher2_id")
    }
  ],
  "attendee": ObjectId("teacher1_id")
}
```

### Why Embedded vs Referenced?

**Embedded (asignSubTeach):**
- Subject-teacher assignments are tightly coupled with the class
- Small amount of data
- Frequently accessed together
- No need to query separately

**Referenced (school, attendee):**
- School and teacher exist independently
- Can be referenced by many documents
- Reduces duplication

---

## 5.5 Subject Model

**File:** `api/model/subject.model.js`

```javascript
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School' },
    subject_name: { type: String, required: true },
    subject_codename: { type: String, required: true },
    createdAt: { type: Date, default: new Date() }
});

module.exports = mongoose.model("Subject", subjectSchema);
```

### Field Explanations:

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `school` | ObjectId | Reference to School | - |
| `subject_name` | String | Full subject name | "Mathematics" |
| `subject_codename` | String | Short code | "MATH101" |

---

## 5.6 Course Model

**File:** `api/model/course.model.js`

```javascript
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },
    courseName: { type: String, required: true, trim: true },
    courseCode: { type: String, required: false, trim: true, uppercase: true },
    description: { type: String, trim: true, required: false },
    duration: {
        type: String,
        required: false,
        enum: ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6 Months', 'Other', '']
    },
    category: { type: String, required: false },
    totalFees: { type: Number, required: false, min: 0, default: 0 },
    subjects: [{ type: mongoose.Schema.ObjectId, ref: 'Subject' }],
    eligibilityCriteria: { type: String, trim: true, required: false },
    maxStudents: { type: Number, min: 1, required: false },
    currentEnrollment: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sparse unique index
courseSchema.index({ courseCode: 1, school: 1 }, { unique: true, sparse: true });

// Pre-save middleware
courseSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for checking if course is full
courseSchema.virtual('isFull').get(function() {
    return this.maxStudents && this.currentEnrollment >= this.maxStudents;
});

// Virtual for available slots
courseSchema.virtual('availableSlots').get(function() {
    return this.maxStudents ? this.maxStudents - this.currentEnrollment : null;
});

module.exports = mongoose.model("Course", courseSchema);
```

### Field Explanations:

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `courseName` | String | Course name | "Computer Science" |
| `courseCode` | String | Unique code | "CS101" |
| `description` | String | Course details | "Learn programming..." |
| `duration` | String (enum) | Course length | "3 Years" |
| `category` | String | Course type | "Undergraduate" |
| `totalFees` | Number | Course fees | 50000 |
| `subjects` | Array[ObjectId] | Subjects in course | [math_id, science_id] |
| `eligibilityCriteria` | String | Entry requirements | "10th Pass" |
| `maxStudents` | Number | Max enrollment | 100 |
| `currentEnrollment` | Number | Current count | 75 |
| `isActive` | Boolean | Active status | true |

### Advanced Features:

**1. Compound Unique Index:**
```javascript
courseSchema.index({ courseCode: 1, school: 1 }, { unique: true, sparse: true });
```
- Ensures `courseCode` is unique **within each school**
- Different schools can have same courseCode
- `sparse: true` allows courses without courseCode

**2. Virtuals (Computed Properties):**
```javascript
// Check if course is full
courseSchema.virtual('isFull').get(function() {
    return this.maxStudents && this.currentEnrollment >= this.maxStudents;
});

// Usage:
const course = await Course.findById(id);
if (course.isFull) {
    console.log('Course is full!');
}
```

**3. Pre-save Hook:**
```javascript
courseSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});
```
- Automatically updates `updatedAt` field
- Runs before every save operation

---

## 5.7 Attendance Model

**File:** `api/model/attendance.model.js`

```javascript
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Absent' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
```

### Field Explanations:

| Field | Type | Purpose |
|-------|------|---------|
| `school` | ObjectId | Reference to School |
| `student` | ObjectId | Reference to Student |
| `class` | ObjectId | Reference to Class |
| `date` | Date | Attendance date |
| `status` | String (enum) | Present/Absent |
| `timestamps` | Auto | createdAt, updatedAt |

### Sample Query:

```javascript
// Get attendance for a student in October 2025
const attendance = await Attendance.find({
    student: studentId,
    date: {
        $gte: new Date('2025-10-01'),
        $lt: new Date('2025-11-01')
    }
}).populate('student class');

// Calculate attendance percentage
const totalDays = attendance.length;
const presentDays = attendance.filter(a => a.status === 'Present').length;
const percentage = (presentDays / totalDays) * 100;
```

---

## 5.8 Examination Model

**File:** `api/model/examination.model.js`

```javascript
const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School' },
    examDate: { type: String, required: true },
    subject: { type: mongoose.Schema.ObjectId, ref: "Subject" },
    examType: { type: String, required: true },
    status: { type: String, default: 'pending' },
    class: { type: mongoose.Schema.ObjectId, ref: "Class" },
    createdAt: { type: Date, default: new Date() }
});

module.exports = mongoose.model("Examination", examinationSchema);
```

### Field Explanations:

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `examDate` | String | Exam date | "2025-10-15" |
| `subject` | ObjectId | Subject reference | Math ID |
| `examType` | String | Exam category | "Midterm", "Final" |
| `status` | String | Exam status | "pending", "completed" |
| `class` | ObjectId | Class reference | 10th Standard |

---

## 5.9 Fees Model

**File:** `api/model/fees.model.js`

```javascript
const mongoose = require('mongoose');

const feesSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    academic_year: { type: String, required: true },
    total_fees: { type: Number, required: true },
    paid_amount: { type: Number, default: 0 },
    balance_amount: { type: Number, required: true },
    payment_date: { type: Date },
    due_date: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' },
    payment_method: { type: String, enum: ['Cash', 'Card', 'Online', 'Cheque'], default: 'Cash' },
    remarks: { type: String }
}, { timestamps: true });

// Calculate balance and update status before saving
feesSchema.pre('save', function(next) {
    this.balance_amount = this.total_fees - this.paid_amount;

    if (this.paid_amount === 0) {
        this.status = 'Pending';
    } else if (this.paid_amount >= this.total_fees) {
        this.status = 'Paid';
        this.balance_amount = 0;
    } else {
        this.status = 'Partial';
    }

    next();
});

module.exports = mongoose.model('Fees', feesSchema);
```

### Field Explanations:

| Field | Type | Purpose |
|-------|------|---------|
| `academic_year` | String | Year (2024-2025) |
| `total_fees` | Number | Total amount due |
| `paid_amount` | Number | Amount paid |
| `balance_amount` | Number | Remaining (calculated) |
| `payment_date` | Date | When payment made |
| `due_date` | Date | Payment deadline |
| `status` | Enum | Paid/Partial/Pending |
| `payment_method` | Enum | Cash/Card/Online/Cheque |

### Pre-save Middleware (Smart Logic):

```javascript
feesSchema.pre('save', function(next) {
    // Auto-calculate balance
    this.balance_amount = this.total_fees - this.paid_amount;

    // Auto-update status
    if (this.paid_amount === 0) {
        this.status = 'Pending';
    } else if (this.paid_amount >= this.total_fees) {
        this.status = 'Paid';
        this.balance_amount = 0;  // Ensure no negative balance
    } else {
        this.status = 'Partial';
    }

    next();
});
```

**Example:**
```javascript
const fees = new Fees({
    total_fees: 10000,
    paid_amount: 5000
});

await fees.save();

// Automatically sets:
// balance_amount = 5000
// status = 'Partial'
```

---

## 5.10 Notice Model

**File:** `api/model/notice.model.js`

```javascript
const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: { type: String, enum: ["student", "teacher"], required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notice", NoticeSchema);
```

### Field Explanations:

| Field | Type | Purpose |
|-------|------|---------|
| `title` | String | Notice title |
| `message` | String | Notice content |
| `audience` | Enum | Who can see (student/teacher) |
| `date` | Date | Publication date |

### Usage Example:

```javascript
// Create notice for students
await Notice.create({
    school: schoolId,
    title: "Holiday Notice",
    message: "School will remain closed on Monday",
    audience: "student"
});

// Get all student notices
const notices = await Notice.find({
    school: schoolId,
    audience: "student"
}).sort({ date: -1 });
```

---

## 5.11 Period Model

**File:** `api/model/period.model.js`

```javascript
const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Period', periodSchema);
```

### Field Explanations:

| Field | Type | Purpose |
|-------|------|---------|
| `teacher` | ObjectId | Who teaches |
| `subject` | ObjectId | What subject |
| `class` | ObjectId | Which class |
| `startTime` | Date | Period start |
| `endTime` | Date | Period end |

### Example Timetable:

```javascript
// Monday 9:00 AM - 10:00 AM: Math class for 10th
const period = await Period.create({
    school: schoolId,
    teacher: mathTeacherId,
    subject: mathSubjectId,
    class: class10thId,
    startTime: new Date('2025-10-20T09:00:00'),
    endTime: new Date('2025-10-20T10:00:00')
});

// Get today's schedule for a teacher
const today = new Date();
today.setHours(0, 0, 0, 0);

const schedule = await Period.find({
    teacher: teacherId,
    startTime: { $gte: today }
}).populate('subject class');
```

---

## 5.12 Student Record Model

**File:** `api/model/studentRecord.model.js`

This is a comprehensive student profile with all details.

```javascript
const mongoose = require('mongoose');

const studentRecordSchema = new mongoose.Schema({
    // Personal Information
    student_name: { type: String, required: true },
    father_name: { type: String },
    mother_name: { type: String },
    date_of_birth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    blood_group: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    religion: { type: String },
    caste: { type: String },
    nationality: { type: String, default: 'Indian' },

    // School Information
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    school_name: { type: String },
    school_id: { type: String },
    established_year: { type: Number },
    class: { type: String },
    section: { type: String },
    roll_number: { type: String },
    admission_number: { type: String },
    admission_date: { type: Date, default: Date.now },
    academic_year: { type: String },

    // Contact Information
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String, default: 'India' }
    },
    phone_number: { type: String },
    email: { type: String },
    emergency_contact: {
        name: { type: String },
        relationship: { type: String },
        phone: { type: String }
    },

    // Fees Information
    fees: {
        total_fees: { type: Number, required: true, default: 0 },
        paid_fees: { type: Number, default: 0 },
        balance_fees: { type: Number, default: 0 },
        transport_fees: { type: Number, default: 0 }
    },

    // Additional
    previous_school: { type: String },
    medical_conditions: { type: String },
    transport_required: { type: Boolean, default: false },
    hostel_required: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Inactive', 'Transferred', 'Graduated'], default: 'Active' },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Pre-save middleware
studentRecordSchema.pre('save', function(next) {
    if (this.fees) {
        this.fees.balance_fees = (this.fees.total_fees || 0) - (this.fees.paid_fees || 0);
    }
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('StudentRecord', studentRecordSchema);
```

### Why StudentRecord vs Student?

**Student Model:**
- For authentication (login)
- Basic info
- Links to Class, Course
- Used in day-to-day operations

**StudentRecord Model:**
- Comprehensive profile
- Admission details
- Complete family info
- Medical records
- Used for reports, records

---

*Continued in next part due to length...*

