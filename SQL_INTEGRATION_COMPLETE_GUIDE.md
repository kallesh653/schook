# SQL DATABASE INTEGRATION GUIDE
## Adding SQL/PostgreSQL Support to School Management System

---

## TABLE OF CONTENTS

1. [MongoDB vs SQL - Complete Comparison](#1-mongodb-vs-sql---complete-comparison)
2. [Why Add SQL Database Support](#2-why-add-sql-database-support)
3. [Installing PostgreSQL/MySQL](#3-installing-postgresqlmysql)
4. [Sequelize ORM Setup](#4-sequelize-orm-setup)
5. [Converting MongoDB Schemas to SQL](#5-converting-mongodb-schemas-to-sql)
6. [All SQL Table Definitions](#6-all-sql-table-definitions)
7. [Migration Strategy](#7-migration-strategy)
8. [Dual Database Support](#8-dual-database-support)
9. [Code Examples](#9-code-examples)
10. [Performance Comparison](#10-performance-comparison)

---

# 1. MONGODB VS SQL - COMPLETE COMPARISON

## Data Structure Comparison

### MongoDB (Current):
```javascript
// Student Document (NoSQL)
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "age": 18,
  "email": "john@student.com",
  "student_class": ObjectId("class123"),  // Reference
  "fees": {                                // Embedded Document
    "total_fees": 10000,
    "paid_fees": 5000,
    "balance_fees": 5000
  },
  "createdAt": ISODate("2025-10-01")
}
```

### PostgreSQL (Relational):
```sql
-- Students Table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    email VARCHAR(255) UNIQUE NOT NULL,
    class_id INTEGER REFERENCES classes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fees Table (Separate)
CREATE TABLE student_fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    total_fees DECIMAL(10,2) NOT NULL,
    paid_fees DECIMAL(10,2) DEFAULT 0,
    balance_fees DECIMAL(10,2) GENERATED ALWAYS AS (total_fees - paid_fees) STORED
);
```

## Feature Comparison Table

| Feature | MongoDB | PostgreSQL/MySQL |
|---------|---------|------------------|
| **Schema** | Flexible, dynamic | Fixed, strict |
| **Joins** | $lookup (slower) | Native JOINs (fast) |
| **Transactions** | Multi-doc (4.0+) | Full ACID |
| **Relationships** | References/Embedded | Foreign Keys |
| **Indexing** | Flexible | B-tree, Hash |
| **Query Language** | MQL (JSON) | SQL |
| **Scaling** | Horizontal (sharding) | Vertical (bigger server) |
| **Data Integrity** | Application-level | Database-level |
| **Complex Queries** | Limited aggregation | Powerful (GROUP BY, etc) |
| **Best For** | Rapid dev, flexible data | Complex reports, strict data |

## When to Use SQL vs MongoDB

### Use SQL When:
✅ Complex relationships (many-to-many)
✅ Financial transactions (strict ACID)
✅ Complex reporting and analytics
✅ Data integrity is critical
✅ Team familiar with SQL
✅ Mature, stable schema

### Use MongoDB When:
✅ Rapid development
✅ Schema changes frequently
✅ Document-based data (JSON)
✅ Horizontal scaling needed
✅ Real-time analytics
✅ Storing logs, events

### Our School Management System:
**Current:** MongoDB (good choice for flexibility)
**Consider SQL for:** Fees management, Complex reports, Financial data

---

# 2. WHY ADD SQL DATABASE SUPPORT

## Benefits for School Management System:

### 1. Better Financial Data Integrity
```sql
-- SQL ensures fees calculation is always correct
CREATE TABLE fees (
    total_fees DECIMAL(10,2) NOT NULL CHECK (total_fees >= 0),
    paid_fees DECIMAL(10,2) DEFAULT 0 CHECK (paid_fees >= 0),
    balance_fees DECIMAL(10,2) GENERATED ALWAYS AS (total_fees - paid_fees) STORED,
    CHECK (paid_fees <= total_fees)
);
```

### 2. Complex Reporting
```sql
-- Easy to generate reports like "Class-wise fee collection"
SELECT
    c.class_text,
    COUNT(s.id) as total_students,
    SUM(f.total_fees) as total_fees,
    SUM(f.paid_fees) as collected,
    SUM(f.balance_fees) as pending
FROM classes c
JOIN students s ON s.class_id = c.id
JOIN fees f ON f.student_id = s.id
GROUP BY c.id, c.class_text
ORDER BY c.class_num;
```

### 3. Data Consistency
```sql
-- Foreign keys ensure referential integrity
ALTER TABLE students
    ADD CONSTRAINT fk_class
    FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON DELETE RESTRICT;  -- Cannot delete class if students exist
```

### 4. ACID Transactions
```sql
-- Ensure payment is recorded atomically
BEGIN TRANSACTION;
    UPDATE fees SET paid_fees = paid_fees + 5000 WHERE student_id = 123;
    INSERT INTO payment_history (student_id, amount, date) VALUES (123, 5000, NOW());
COMMIT;
-- Both succeed or both fail (no partial updates)
```

---

# 3. INSTALLING POSTGRESQL/MYSQL

## Option 1: PostgreSQL (Recommended)

### Windows Installation:

```bash
# Download installer from:
https://www.postgresql.org/download/windows/

# Or use Chocolatey:
choco install postgresql

# Start PostgreSQL service:
net start postgresql-x64-14
```

### Ubuntu/Linux Installation:

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Access PostgreSQL shell
sudo -u postgres psql
```

### macOS Installation:

```bash
# Using Homebrew
brew install postgresql@14

# Start service
brew services start postgresql@14
```

### Create Database:

```sql
-- Login to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE school_management;

-- Create user
CREATE USER schooladmin WITH PASSWORD 'securepassword';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE school_management TO schooladmin;

-- Connect to database
\c school_management
```

## Option 2: MySQL

### Installation:

```bash
# Windows: Download from
https://dev.mysql.com/downloads/installer/

# Ubuntu
sudo apt install mysql-server

# macOS
brew install mysql
```

### Create Database:

```sql
mysql -u root -p

CREATE DATABASE school_management;
CREATE USER 'schooladmin'@'localhost' IDENTIFIED BY 'securepassword';
GRANT ALL PRIVILEGES ON school_management.* TO 'schooladmin'@'localhost';
FLUSH PRIVILEGES;
```

---

# 4. SEQUELIZE ORM SETUP

**Sequelize** is like Mongoose but for SQL databases.

## Installation:

```bash
cd api

# Install Sequelize and PostgreSQL driver
npm install sequelize pg pg-hstore

# OR for MySQL:
npm install sequelize mysql2

# Install Sequelize CLI (optional, for migrations)
npm install --save-dev sequelize-cli
```

## Initialize Sequelize:

```bash
# Create config and folders
npx sequelize-cli init

# This creates:
# - config/config.json       # Database configuration
# - models/index.js           # Model loader
# - migrations/               # Database migrations
# - seeders/                  # Sample data
```

## Configure Database Connection:

**File:** `api/config/database.js`

```javascript
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'schooladmin',
    password: process.env.DB_PASSWORD || 'securepassword',
    database: process.env.DB_NAME || 'school_management',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',  // or 'mysql'
    logging: console.log  // Log SQL queries
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};
```

## Update .env File:

```env
# MongoDB (existing)
MONGODB_URI=mongodb+srv://...

# PostgreSQL (new)
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=schooladmin
DB_PASSWORD=securepassword
DB_NAME=school_management
```

## Initialize Sequelize in Server:

**File:** `api/database/sequelize.js`

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE || 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected successfully');
  })
  .catch(err => {
    console.error('Unable to connect to PostgreSQL:', err);
  });

module.exports = sequelize;
```

## Update server.js:

```javascript
// ADD after MongoDB connection

// PostgreSQL Connection
const sequelize = require('./database/sequelize');

sequelize.sync({ alter: true })  // Sync models with database
  .then(() => {
    console.log('PostgreSQL tables synchronized');
  })
  .catch(err => {
    console.log('PostgreSQL sync error:', err);
  });
```

---

# 5. CONVERTING MONGODB SCHEMAS TO SQL

## Mongoose Schema → Sequelize Model

### Example: Student Model

**MongoDB (current):**

```javascript
// api/model/student.model.js
const studentSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.ObjectId, ref: 'School' },
    email: { type: String, required: true },
    name: { type: String, required: true },
    student_class: { type: mongoose.Schema.ObjectId, ref: "Class" },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    fees: {
        total_fees: { type: Number, default: 0 },
        paid_fees: { type: Number, default: 0 },
        balance_fees: { type: Number, default: 0 }
    }
});
```

**PostgreSQL with Sequelize:**

```javascript
// api/models/student.model.sql.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 5,
      max: 100
    }
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false
  },
  guardian: {
    type: DataTypes.STRING
  },
  guardian_phone: {
    type: DataTypes.STRING(15)
  },
  student_image: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Foreign Keys
  school_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Schools',
      key: 'id'
    }
  },
  class_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Classes',
      key: 'id'
    }
  }
}, {
  tableName: 'students',
  timestamps: true,  // createdAt, updatedAt
  underscored: true  // Use snake_case for column names
});

module.exports = Student;
```

**Fees as Separate Table:**

```javascript
// api/models/student_fees.model.sql.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const StudentFees = sequelize.define('StudentFees', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  total_fees: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  paid_fees: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  balance_fees: {
    type: DataTypes.VIRTUAL,  // Calculated field
    get() {
      return this.total_fees - this.paid_fees;
    }
  }
}, {
  tableName: 'student_fees',
  timestamps: true
});

module.exports = StudentFees;
```

---

# 6. ALL SQL TABLE DEFINITIONS

## Complete SQL Schema for School Management System

### 1. Schools Table

```sql
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    school_image VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Sequelize Model:**

```javascript
const School = sequelize.define('School', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  school_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  owner_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  school_image: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
```

### 2. Students Table

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    class_id INTEGER REFERENCES classes(id),
    course_id INTEGER REFERENCES courses(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    guardian VARCHAR(255),
    guardian_phone VARCHAR(15),
    aadhaar_number VARCHAR(12) UNIQUE,
    student_image VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT check_aadhaar CHECK (aadhaar_number ~ '^\d{12}$' OR aadhaar_number IS NULL)
);

CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_email ON students(email);
```

### 3. Teachers Table

```sql
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    qualification VARCHAR(255),
    age INTEGER CHECK (age > 18),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    teacher_image VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Classes Table

```sql
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    class_text VARCHAR(100) NOT NULL,
    class_num INTEGER NOT NULL CHECK (class_num > 0),
    attendee_id INTEGER REFERENCES teachers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(school_id, class_num)
);
```

### 5. Subjects Table

```sql
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    subject_name VARCHAR(255) NOT NULL,
    subject_codename VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(school_id, subject_codename)
);
```

### 6. Class Subject Teacher Assignment (Many-to-Many)

```sql
CREATE TABLE class_subject_teachers (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(class_id, subject_id)
);
```

### 7. Courses Table

```sql
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    course_name VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) UNIQUE,
    description TEXT,
    duration VARCHAR(50) CHECK (duration IN ('1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6 Months', 'Other')),
    category VARCHAR(100),
    total_fees DECIMAL(10,2) DEFAULT 0 CHECK (total_fees >= 0),
    max_students INTEGER CHECK (max_students > 0),
    current_enrollment INTEGER DEFAULT 0 CHECK (current_enrollment >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(school_id, course_code)
);
```

### 8. Course Subjects (Many-to-Many)

```sql
CREATE TABLE course_subjects (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,

    UNIQUE(course_id, subject_id)
);
```

### 9. Attendance Table

```sql
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, date);
```

### 10. Examinations Table

```sql
CREATE TABLE examinations (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    subject_id INTEGER REFERENCES subjects(id),
    exam_date DATE NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 11. Student Fees Table

```sql
CREATE TABLE student_fees (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    academic_year VARCHAR(20) NOT NULL,
    total_fees DECIMAL(10,2) NOT NULL CHECK (total_fees >= 0),
    paid_amount DECIMAL(10,2) DEFAULT 0 CHECK (paid_amount >= 0),
    balance_amount DECIMAL(10,2) GENERATED ALWAYS AS (total_fees - paid_amount) STORED,
    payment_date TIMESTAMP,
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Paid', 'Partial', 'Pending')),
    payment_method VARCHAR(20) CHECK (payment_method IN ('Cash', 'Card', 'Online', 'Cheque')),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (paid_amount <= total_fees)
);
```

### 12. Notices Table

```sql
CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    audience VARCHAR(20) NOT NULL CHECK (audience IN ('student', 'teacher')),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 13. Periods/Schedule Table

```sql
CREATE TABLE periods (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    teacher_id INTEGER NOT NULL REFERENCES teachers(id),
    subject_id INTEGER REFERENCES subjects(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (end_time > start_time)
);
```

### 14. Student Records Table

```sql
CREATE TABLE student_records (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    student_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    blood_group VARCHAR(5) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    religion VARCHAR(50),
    caste VARCHAR(50),
    nationality VARCHAR(50) DEFAULT 'Indian',
    school_name VARCHAR(255),
    school_id_number VARCHAR(50),
    class VARCHAR(50),
    section VARCHAR(10),
    roll_number VARCHAR(50),
    admission_number VARCHAR(50),
    admission_date DATE DEFAULT CURRENT_DATE,
    academic_year VARCHAR(20),
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    country VARCHAR(50) DEFAULT 'India',
    phone_number VARCHAR(15),
    email VARCHAR(255),
    emergency_contact_name VARCHAR(255),
    emergency_contact_relationship VARCHAR(50),
    emergency_contact_phone VARCHAR(15),
    total_fees DECIMAL(10,2) DEFAULT 0,
    paid_fees DECIMAL(10,2) DEFAULT 0,
    balance_fees DECIMAL(10,2) GENERATED ALWAYS AS (total_fees - paid_fees) STORED,
    transport_fees DECIMAL(10,2) DEFAULT 0,
    previous_school VARCHAR(255),
    medical_conditions TEXT,
    transport_required BOOLEAN DEFAULT FALSE,
    hostel_required BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Transferred', 'Graduated')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 7. MIGRATION STRATEGY

## Step-by-Step Migration from MongoDB to PostgreSQL

### Step 1: Export Data from MongoDB

```javascript
// scripts/export_mongo_data.js
const mongoose = require('mongoose');
const fs = require('fs');

// Models
const School = require('../api/model/school.model');
const Student = require('../api/model/student.model');
// ... import all models

async function exportData() {
  await mongoose.connect(process.env.MONGODB_URI);

  const schools = await School.find({}).lean();
  const students = await Student.find({}).populate('school student_class').lean();

  fs.writeFileSync('./data/schools.json', JSON.stringify(schools, null, 2));
  fs.writeFileSync('./data/students.json', JSON.stringify(students, null, 2));

  console.log('Data exported successfully');
  process.exit(0);
}

exportData();
```

**Run:**
```bash
node scripts/export_mongo_data.js
```

### Step 2: Transform Data for PostgreSQL

```javascript
// scripts/transform_data.js
const fs = require('fs');

function transformStudents() {
  const students = JSON.parse(fs.readFileSync('./data/students.json'));

  const transformed = students.map(student => ({
    email: student.email,
    name: student.name,
    age: parseInt(student.age),
    gender: student.gender,
    guardian: student.guardian,
    guardian_phone: student.guardian_phone,
    student_image: student.student_image,
    password: student.password,
    school_id: student.school._id,  // Will need to map ObjectId to SQL id
    class_id: student.student_class?._id
  }));

  fs.writeFileSync('./data/students_sql.json', JSON.stringify(transformed, null, 2));
}

transformStudents();
```

### Step 3: Import Data to PostgreSQL

```javascript
// scripts/import_to_postgres.js
const sequelize = require('../api/database/sequelize');
const Student = require('../api/models/student.model.sql');
const fs = require('fs');

async function importData() {
  const students = JSON.parse(fs.readFileSync('./data/students_sql.json'));

  await sequelize.sync({ force: true });  // Recreate tables

  for (const studentData of students) {
    await Student.create(studentData);
  }

  console.log(`Imported ${students.length} students`);
}

importData();
```

---

# 8. DUAL DATABASE SUPPORT

## Running MongoDB and PostgreSQL Together

### Strategy 1: Database Selector

```javascript
// api/config/database.selector.js
const DB_TYPE = process.env.DB_TYPE || 'mongodb';  // or 'postgres'

module.exports = { DB_TYPE };
```

### Strategy 2: Abstract Repository Pattern

```javascript
// api/repositories/student.repository.js
const { DB_TYPE } = require('../config/database.selector');

class StudentRepository {
  constructor() {
    if (DB_TYPE === 'mongodb') {
      this.model = require('../model/student.model');  // Mongoose
      this.type = 'mongodb';
    } else {
      this.model = require('../models/student.model.sql');  // Sequelize
      this.type = 'postgres';
    }
  }

  async findAll() {
    if (this.type === 'mongodb') {
      return await this.model.find({}).populate('student_class');
    } else {
      return await this.model.findAll({
        include: [{ model: require('../models/class.model.sql'), as: 'class' }]
      });
    }
  }

  async findById(id) {
    if (this.type === 'mongodb') {
      return await this.model.findById(id);
    } else {
      return await this.model.findByPk(id);
    }
  }

  async create(data) {
    if (this.type === 'mongodb') {
      const student = new this.model(data);
      return await student.save();
    } else {
      return await this.model.create(data);
    }
  }
}

module.exports = new StudentRepository();
```

### Use in Controller:

```javascript
// api/controller/student.controller.js
const studentRepo = require('../repositories/student.repository');

const getAllStudents = async (req, res) => {
  try {
    const students = await studentRepo.findAll();
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

# 9. CODE EXAMPLES

## Complete Sequelize CRUD Example

```javascript
// api/controllers/student.controller.sql.js
const Student = require('../models/student.model.sql');
const Class = require('../models/class.model.sql');

// CREATE
const createStudent = async (req, res) => {
  try {
    const student = await Student.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      age: req.body.age,
      gender: req.body.gender,
      school_id: req.user.schoolId,
      class_id: req.body.class_id
    });

    res.status(201).json({ success: true, data: student });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ success: false, message: 'Email already exists' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// READ ALL
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { school_id: req.user.schoolId },
      include: [{
        model: Class,
        as: 'class',
        attributes: ['id', 'class_text', 'class_num']
      }],
      order: [['name', 'ASC']]
    });

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// READ ONE
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: {
        id: req.params.id,
        school_id: req.user.schoolId
      },
      include: [{ model: Class, as: 'class' }]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
const updateStudent = async (req, res) => {
  try {
    const [updated] = await Student.update(req.body, {
      where: {
        id: req.params.id,
        school_id: req.user.schoolId
      }
    });

    if (updated === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = await Student.findByPk(req.params.id);
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.destroy({
      where: {
        id: req.params.id,
        school_id: req.user.schoolId
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({ success: true, message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SEARCH
const searchStudents = async (req, res) => {
  try {
    const { search, class_id } = req.query;
    const where = { school_id: req.user.schoolId };

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`  // Case-insensitive search
      };
    }

    if (class_id) {
      where.class_id = class_id;
    }

    const students = await Student.findAll({
      where,
      include: [{ model: Class, as: 'class' }]
    });

    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

# 10. PERFORMANCE COMPARISON

## Query Performance

### MongoDB:
```javascript
// Get students with class info
const students = await Student.find({ school: schoolId })
  .populate('student_class');
// 2 queries: Students + Classes
```

### PostgreSQL:
```sql
-- Same query
SELECT s.*, c.class_text, c.class_num
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
WHERE s.school_id = 1;
-- 1 query with JOIN (faster)
```

### Complex Report Example:

**MongoDB (Aggregation Pipeline):**
```javascript
const report = await Student.aggregate([
  { $match: { school: schoolId } },
  { $lookup: { from: 'classes', localField: 'student_class', foreignField: '_id', as: 'class' } },
  { $unwind: '$class' },
  { $group: {
      _id: '$class.class_text',
      total_students: { $sum: 1 },
      total_fees: { $sum: '$fees.total_fees' },
      paid_fees: { $sum: '$fees.paid_fees' }
    }
  }
]);
```

**PostgreSQL (SQL):**
```sql
SELECT
  c.class_text,
  COUNT(s.id) as total_students,
  SUM(f.total_fees) as total_fees,
  SUM(f.paid_amount) as paid_fees,
  SUM(f.balance_amount) as balance
FROM classes c
LEFT JOIN students s ON s.class_id = c.id
LEFT JOIN student_fees f ON f.student_id = s.id
WHERE c.school_id = 1
GROUP BY c.id, c.class_text;
```

**Result:** PostgreSQL is typically 2-3x faster for complex reports.

---

## Summary

✅ You now have a complete guide to add SQL support
✅ All table schemas provided
✅ Sequelize setup instructions
✅ Migration strategy
✅ Dual database support pattern
✅ Code examples for CRUD operations

**Next Steps:**
1. Choose between PostgreSQL or MySQL
2. Install database
3. Set up Sequelize
4. Create models
5. Test with sample data
6. Gradually migrate from MongoDB

---

**End of SQL Integration Guide**
