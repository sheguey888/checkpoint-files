# University Information System - Database Checkpoint

This checkpoint evaluates the design of a normalized relational database and SQL query execution for a university information system.

---

## Step 1 - Schema Design

### Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         UNIVERSITY DATABASE SCHEMA                           │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐         ┌─────────────────┐         ┌──────────────┐
    │   STUDENTS   │         │   ENROLLMENTS   │         │   COURSES    │
    ├──────────────┤         ├─────────────────┤         ├──────────────┤
    │ PK student_id│◄────────┤ PK enrollment_id│    ┌───►│ PK course_id │
    │    name      │    1:M  │ FK student_id   │    M:1 │    title     │
    │    email     │         │ FK course_id    │◄───────┤    credits   │
    │    age       │         │    grade        │        │ FK instructor│
    │    major     │         │    enroll_date  │        │              │
    └──────────────┘         └─────────────────┘        └──────┬───────┘
                                                               │
                                                               │ M:1
                                                               ▼
                                                    ┌──────────────────┐
                                                    │   INSTRUCTORS    │
                                                    ├──────────────────┤
                                                    │ PK instructor_id │
                                                    │    name          │
                                                    │    department    │
                                                    │    email         │
                                                    │    hire_date     │
                                                    └──────────────────┘
```

### Normalization Analysis

#### First Normal Form (1NF)
- ✅ All attributes contain **atomic values** (no repeating groups)
- ✅ Each table has a **primary key**
- ✅ No multi-valued attributes

#### Second Normal Form (2NF)
- ✅ All non-key attributes are **fully functionally dependent** on the primary key
- ✅ No partial dependencies
- ✅ Enrollments table uses composite key (student_id + course_id) with surrogate enrollment_id

#### Third Normal Form (3NF)
- ✅ **No transitive dependencies** (non-key attributes depend only on the primary key)
- ✅ Instructor information is separated into its own table
- ✅ Student and Course details are in their respective tables

### Schema Tables

| Table | Primary Key | Foreign Keys | Purpose |
|-------|-------------|--------------|---------|
| **Students** | student_id | - | Store student information |
| **Instructors** | instructor_id | - | Store instructor information |
| **Courses** | course_id | instructor_id | Store course details |
| **Enrollments** | enrollment_id | student_id, course_id | Link students to courses |

---

## Step 2 - SQL Table Creation

### Complete SQL DDL Statements

```sql
-- =====================================================
-- STEP 2: CREATE TABLES WITH CONSTRAINTS
-- =====================================================

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Instructors;
DROP TABLE IF EXISTS Students;

-- -----------------------------------------------------
-- Table: Students
-- -----------------------------------------------------
CREATE TABLE Students (
    student_id      INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    age             INT NOT NULL CHECK (age > 17 AND age < 100),
    major           VARCHAR(50),
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    
    CONSTRAINT chk_email_format CHECK (email LIKE '%@%.%')
);

-- -----------------------------------------------------
-- Table: Instructors
-- -----------------------------------------------------
CREATE TABLE Instructors (
    instructor_id   INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    department      VARCHAR(50) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    hire_date       DATE DEFAULT (CURRENT_DATE),
    
    CONSTRAINT chk_instructor_email CHECK (email LIKE '%@%.%')
);

-- -----------------------------------------------------
-- Table: Courses
-- -----------------------------------------------------
CREATE TABLE Courses (
    course_id       INT PRIMARY KEY AUTO_INCREMENT,
    title           VARCHAR(100) NOT NULL,
    credits         INT NOT NULL CHECK (credits > 0 AND credits <= 6),
    instructor_id   INT,
    description     TEXT,
    
    CONSTRAINT fk_course_instructor 
        FOREIGN KEY (instructor_id) 
        REFERENCES Instructors(instructor_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table: Enrollments
-- -----------------------------------------------------
CREATE TABLE Enrollments (
    enrollment_id   INT PRIMARY KEY AUTO_INCREMENT,
    student_id      INT NOT NULL,
    course_id       INT NOT NULL,
    grade           VARCHAR(2) CHECK (grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 
                                                 'C+', 'C', 'C-', 'D+', 'D', 'F', NULL)),
    enroll_date     DATE DEFAULT (CURRENT_DATE),
    
    CONSTRAINT fk_enrollment_student 
        FOREIGN KEY (student_id) 
        REFERENCES Students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_enrollment_course 
        FOREIGN KEY (course_id) 
        REFERENCES Courses(course_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT uq_student_course UNIQUE (student_id, course_id)
);

-- -----------------------------------------------------
-- Create Indexes for Performance
-- -----------------------------------------------------
CREATE INDEX idx_student_email ON Students(email);
CREATE INDEX idx_course_title ON Courses(title);
CREATE INDEX idx_enrollment_student ON Enrollments(student_id);
CREATE INDEX idx_enrollment_course ON Enrollments(course_id);
```

### Constraints Summary

| Table | Constraint Type | Column | Description |
|-------|-----------------|--------|-------------|
| Students | PRIMARY KEY | student_id | Unique identifier |
| Students | NOT NULL | name, email, age | Required fields |
| Students | UNIQUE | email | No duplicate emails |
| Students | CHECK | age | Must be 18-99 |
| Students | CHECK | email | Must contain @ and . |
| Instructors | PRIMARY KEY | instructor_id | Unique identifier |
| Instructors | NOT NULL | name, department, email | Required fields |
| Instructors | UNIQUE | email | No duplicate emails |
| Courses | PRIMARY KEY | course_id | Unique identifier |
| Courses | NOT NULL | title, credits | Required fields |
| Courses | CHECK | credits | Must be 1-6 |
| Courses | FOREIGN KEY | instructor_id | References Instructors |
| Enrollments | PRIMARY KEY | enrollment_id | Unique identifier |
| Enrollments | FOREIGN KEY | student_id | References Students (CASCADE) |
| Enrollments | FOREIGN KEY | course_id | References Courses (CASCADE) |
| Enrollments | UNIQUE | student_id + course_id | No duplicate enrollments |
| Enrollments | CHECK | grade | Valid grade values only |

---

## Step 3 - Insert Sample Data

### SQL INSERT Statements

```sql
-- =====================================================
-- STEP 3: INSERT SAMPLE DATA
-- =====================================================

-- -----------------------------------------------------
-- Insert Students (3 students)
-- -----------------------------------------------------
INSERT INTO Students (name, email, age, major, enrollment_date) VALUES
('Alice Johnson', 'alice.johnson@university.edu', 20, 'Computer Science', '2023-09-01'),
('Bob Smith', 'bob.smith@university.edu', 22, 'Mathematics', '2022-09-01'),
('Carol Williams', 'carol.williams@university.edu', 19, 'Physics', '2023-09-01');

-- -----------------------------------------------------
-- Insert Instructors (3 instructors)
-- -----------------------------------------------------
INSERT INTO Instructors (name, department, email, hire_date) VALUES
('Dr. Sarah Chen', 'Computer Science', 'sarah.chen@university.edu', '2018-08-15'),
('Prof. Michael Brown', 'Mathematics', 'michael.brown@university.edu', '2015-01-10'),
('Dr. Emily Davis', 'Physics', 'emily.davis@university.edu', '2020-07-01');

-- -----------------------------------------------------
-- Insert Courses (3 courses)
-- -----------------------------------------------------
INSERT INTO Courses (title, credits, instructor_id, description) VALUES
('Database Systems', 3, 1, 'Introduction to relational databases, SQL, and normalization'),
('Calculus I', 4, 2, 'Differential and integral calculus fundamentals'),
('Quantum Mechanics', 4, 3, 'Introduction to quantum physics principles');

-- -----------------------------------------------------
-- Insert Enrollments (4 enrollment records)
-- -----------------------------------------------------
INSERT INTO Enrollments (student_id, course_id, grade, enroll_date) VALUES
(1, 1, 'A', '2024-01-15'),   -- Alice in Database Systems
(1, 2, 'B+', '2024-01-15'),  -- Alice in Calculus I
(2, 1, 'B', '2024-01-16'),   -- Bob in Database Systems
(3, 3, NULL, '2024-01-17');  -- Carol in Quantum Mechanics (no grade yet)
```

### Sample Data Overview

#### Students Table
| student_id | name | email | age | major |
|------------|------|-------|-----|-------|
| 1 | Alice Johnson | alice.johnson@university.edu | 20 | Computer Science |
| 2 | Bob Smith | bob.smith@university.edu | 22 | Mathematics |
| 3 | Carol Williams | carol.williams@university.edu | 19 | Physics |

#### Instructors Table
| instructor_id | name | department | email |
|---------------|------|------------|-------|
| 1 | Dr. Sarah Chen | Computer Science | sarah.chen@university.edu |
| 2 | Prof. Michael Brown | Mathematics | michael.brown@university.edu |
| 3 | Dr. Emily Davis | Physics | emily.davis@university.edu |

#### Courses Table
| course_id | title | credits | instructor_id |
|-----------|-------|---------|---------------|
| 1 | Database Systems | 3 | 1 |
| 2 | Calculus I | 4 | 2 |
| 3 | Quantum Mechanics | 4 | 3 |

#### Enrollments Table
| enrollment_id | student_id | course_id | grade |
|---------------|------------|-----------|-------|
| 1 | 1 | 1 | A |
| 2 | 1 | 2 | B+ |
| 3 | 2 | 1 | B |
| 4 | 3 | 3 | NULL |

---

## Step 4 - Query Execution

### Query 1: Retrieve all students enrolled in "Database Systems"

```sql
-- Query 1: Students enrolled in "Database Systems"
SELECT 
    s.student_id,
    s.name AS student_name,
    s.email,
    s.major,
    e.grade,
    e.enroll_date
FROM Students s
INNER JOIN Enrollments e ON s.student_id = e.student_id
INNER JOIN Courses c ON e.course_id = c.course_id
WHERE c.title = 'Database Systems';
```

**Expected Output:**
| student_id | student_name | email | major | grade | enroll_date |
|------------|--------------|-------|-------|-------|-------------|
| 1 | Alice Johnson | alice.johnson@university.edu | Computer Science | A | 2024-01-15 |
| 2 | Bob Smith | bob.smith@university.edu | Mathematics | B | 2024-01-16 |

---

### Query 2: List all courses along with their instructors

```sql
-- Query 2: All courses with instructor names
SELECT 
    c.course_id,
    c.title AS course_title,
    c.credits,
    c.description,
    i.name AS instructor_name,
    i.department,
    i.email AS instructor_email
FROM Courses c
LEFT JOIN Instructors i ON c.instructor_id = i.instructor_id
ORDER BY c.course_id;
```

**Expected Output:**
| course_id | course_title | credits | instructor_name | department |
|-----------|--------------|---------|-----------------|------------|
| 1 | Database Systems | 3 | Dr. Sarah Chen | Computer Science |
| 2 | Calculus I | 4 | Prof. Michael Brown | Mathematics |
| 3 | Quantum Mechanics | 4 | Dr. Emily Davis | Physics |

---

### Query 3: Find students who are not enrolled in any course

```sql
-- Query 3: Students with no enrollments
SELECT 
    s.student_id,
    s.name,
    s.email,
    s.major,
    s.enrollment_date
FROM Students s
LEFT JOIN Enrollments e ON s.student_id = e.student_id
WHERE e.enrollment_id IS NULL;
```

**Alternative using NOT EXISTS:**
```sql
-- Alternative: Using NOT EXISTS
SELECT 
    s.student_id,
    s.name,
    s.email,
    s.major
FROM Students s
WHERE NOT EXISTS (
    SELECT 1 FROM Enrollments e 
    WHERE e.student_id = s.student_id
);
```

**Expected Output:**
| student_id | name | email | major |
|------------|------|-------|-------|
| *(Empty - all students are enrolled)* | | | |

*Note: To test this query, add a new student without enrollment:*
```sql
INSERT INTO Students (name, email, age, major) 
VALUES ('David Lee', 'david.lee@university.edu', 21, 'Biology');
```

---

### Query 4: Update a student's email address

```sql
-- Query 4: Update student email
UPDATE Students 
SET email = 'alice.j.newemail@university.edu'
WHERE student_id = 1;

-- Verify the update
SELECT student_id, name, email 
FROM Students 
WHERE student_id = 1;
```

**Before:**
| student_id | name | email |
|------------|------|-------|
| 1 | Alice Johnson | alice.johnson@university.edu |

**After:**
| student_id | name | email |
|------------|------|-------|
| 1 | Alice Johnson | alice.j.newemail@university.edu |

---

### Query 5: Delete a course by its ID

```sql
-- Query 5: Delete a course by ID
-- First, check what will be affected
SELECT * FROM Courses WHERE course_id = 3;
SELECT * FROM Enrollments WHERE course_id = 3;

-- Delete the course (enrollments will be CASCADE deleted)
DELETE FROM Courses WHERE course_id = 3;

-- Verify deletion
SELECT * FROM Courses WHERE course_id = 3;
SELECT * FROM Enrollments WHERE course_id = 3;
```

**Behavior:**
- Course "Quantum Mechanics" (course_id = 3) is deleted
- Due to `ON DELETE CASCADE`, enrollment record for Carol is also deleted
- No orphaned records remain

---

## Additional Useful Queries

### Query: Student enrollment summary
```sql
-- Count enrollments per student
SELECT 
    s.student_id,
    s.name,
    COUNT(e.enrollment_id) AS total_courses,
    AVG(CASE 
        WHEN e.grade = 'A+' THEN 4.0
        WHEN e.grade = 'A' THEN 4.0
        WHEN e.grade = 'A-' THEN 3.7
        WHEN e.grade = 'B+' THEN 3.3
        WHEN e.grade = 'B' THEN 3.0
        WHEN e.grade = 'B-' THEN 2.7
        WHEN e.grade = 'C+' THEN 2.3
        WHEN e.grade = 'C' THEN 2.0
        WHEN e.grade = 'C-' THEN 1.7
        WHEN e.grade = 'D+' THEN 1.3
        WHEN e.grade = 'D' THEN 1.0
        WHEN e.grade = 'F' THEN 0.0
    END) AS gpa
FROM Students s
LEFT JOIN Enrollments e ON s.student_id = e.student_id
GROUP BY s.student_id, s.name;
```

### Query: Course enrollment statistics
```sql
-- Enrollment statistics per course
SELECT 
    c.course_id,
    c.title,
    i.name AS instructor,
    COUNT(e.enrollment_id) AS enrolled_students,
    AVG(CASE 
        WHEN e.grade = 'A' THEN 95
        WHEN e.grade = 'B' THEN 85
        WHEN e.grade = 'C' THEN 75
        WHEN e.grade = 'D' THEN 65
    END) AS avg_grade
FROM Courses c
LEFT JOIN Enrollments e ON c.course_id = e.course_id
LEFT JOIN Instructors i ON c.instructor_id = i.instructor_id
GROUP BY c.course_id, c.title, i.name;
```

---

## Complete Database Script

```sql
-- =====================================================
-- COMPLETE UNIVERSITY DATABASE SETUP SCRIPT
-- =====================================================

-- Clean up existing tables
DROP TABLE IF EXISTS Enrollments;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Instructors;
DROP TABLE IF EXISTS Students;

-- Create Students table
CREATE TABLE Students (
    student_id      INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    age             INT NOT NULL CHECK (age > 17 AND age < 100),
    major           VARCHAR(50),
    enrollment_date DATE DEFAULT (CURRENT_DATE)
);

-- Create Instructors table
CREATE TABLE Instructors (
    instructor_id   INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    department      VARCHAR(50) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    hire_date       DATE DEFAULT (CURRENT_DATE)
);

-- Create Courses table
CREATE TABLE Courses (
    course_id       INT PRIMARY KEY AUTO_INCREMENT,
    title           VARCHAR(100) NOT NULL,
    credits         INT NOT NULL CHECK (credits > 0 AND credits <= 6),
    instructor_id   INT,
    description     TEXT,
    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create Enrollments table
CREATE TABLE Enrollments (
    enrollment_id   INT PRIMARY KEY AUTO_INCREMENT,
    student_id      INT NOT NULL,
    course_id       INT NOT NULL,
    grade           VARCHAR(2),
    enroll_date     DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (student_id, course_id)
);

-- Insert sample data
INSERT INTO Students (name, email, age, major) VALUES
('Alice Johnson', 'alice.johnson@university.edu', 20, 'Computer Science'),
('Bob Smith', 'bob.smith@university.edu', 22, 'Mathematics'),
('Carol Williams', 'carol.williams@university.edu', 19, 'Physics');

INSERT INTO Instructors (name, department, email) VALUES
('Dr. Sarah Chen', 'Computer Science', 'sarah.chen@university.edu'),
('Prof. Michael Brown', 'Mathematics', 'michael.brown@university.edu'),
('Dr. Emily Davis', 'Physics', 'emily.davis@university.edu');

INSERT INTO Courses (title, credits, instructor_id, description) VALUES
('Database Systems', 3, 1, 'Introduction to relational databases'),
('Calculus I', 4, 2, 'Differential and integral calculus'),
('Quantum Mechanics', 4, 3, 'Introduction to quantum physics');

INSERT INTO Enrollments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B+'),
(2, 1, 'B'),
(3, 3, NULL);
```

---

## Summary

| Component | Implementation |
|-----------|----------------|
| **Normalization** | 3NF achieved - no repeating groups, no partial dependencies, no transitive dependencies |
| **Primary Keys** | Auto-increment integers for all tables |
| **Foreign Keys** | Properly defined with CASCADE actions |
| **Constraints** | NOT NULL, UNIQUE, CHECK constraints applied |
| **Sample Data** | 3 students, 3 instructors, 3 courses, 4 enrollments |
| **Queries** | All 5 required queries implemented with JOINs, WHERE, UPDATE, DELETE |

---

*Database Checkpoint - University Information System*
