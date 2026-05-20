const path = require('path');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
require('dotenv').config();

const app = express();

if (!process.env.DATABASE_URL) {
  const defaultDbPath = path.resolve(__dirname, 'dev.db').replace(/\\/g, '/');
  process.env.DATABASE_URL = `file:${defaultDbPath}`;
}

const prisma = new PrismaClient();
console.log('Using SQLite DB at', process.env.DATABASE_URL);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE;
const SMS_MOCK = process.env.SMS_MOCK === 'true';
const twilioClient = !SMS_MOCK && TWILIO_SID && TWILIO_AUTH_TOKEN && TWILIO_SID.startsWith('AC') ? twilio(TWILIO_SID, TWILIO_AUTH_TOKEN) : null;

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Admin Routes
app.post('/api/admin/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check for existing admin with same email
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) return res.status(409).json({ error: 'Admin with this email already exists' });

    const admin = await prisma.admin.create({
      data: { username, email, password: hashedPassword }
    });
    res.json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET);
    res.json({ token, role: 'admin' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Teacher Routes
app.post('/api/teacher/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Prevent duplicate teacher emails
    const existingTeacher = await prisma.teacher.findUnique({ where: { email } });
    if (existingTeacher) return res.status(409).json({ error: 'Teacher with this email already exists' });

    const teacher = await prisma.teacher.create({
      data: { name, email, password: hashedPassword }
    });

    res.json({ message: 'Teacher registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/teacher/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await prisma.teacher.findUnique({ where: { email } });
    if (!teacher || !(await bcrypt.compare(password, teacher.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: teacher.id, role: 'teacher' }, JWT_SECRET);
    res.json({ token, role: 'teacher' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protected Routes
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const totalStudents = await prisma.student.count();
    const totalTeachers = await prisma.teacher.count();
    const totalClasses = await prisma.class.count();
    // Attendance percentage calculation
    const totalAttendance = await prisma.attendance.count();
    const presentCount = await prisma.attendance.count({ where: { status: 'Present' } });
    const attendancePercentage = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      attendancePercentage,
      recentActivities: [] // Can add recent attendance
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/teachers', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const teachers = await prisma.teacher.findMany({
      include: { teacherClasses: { include: { class: true } } }
    });
    res.json(teachers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/teachers', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = await prisma.teacher.create({
      data: { name, email, password: hashedPassword }
    });
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/students', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const students = await prisma.student.findMany({
      include: { class: true }
    });
    res.json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/students', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { name, email, rollNo, classId } = req.body;
    const student = await prisma.student.create({
      data: { name, email, rollNo, classId }
    });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/classes', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const classes = await prisma.class.findMany({
      include: { students: true, teacherClasses: { include: { teacher: true } } }
    });
    res.json(classes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/classes', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { name } = req.body;
    const class_ = await prisma.class.create({
      data: { name }
    });
    res.json(class_);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/assign-teacher', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { teacherId, classId } = req.body;
    const assignment = await prisma.teacherClass.create({
      data: { teacherId, classId }
    });
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Teacher Routes
app.get('/api/teacher/classes', authenticateToken, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Access denied' });
  try {
    const teacherClasses = await prisma.teacherClass.findMany({
      where: { teacherId: req.user.id },
      include: { class: { include: { students: true } } }
    });
    res.json(teacherClasses.map(tc => tc.class));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/teacher/class/:classId/students', authenticateToken, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Access denied' });
  try {
    const { classId } = req.params;
    // Check if teacher is assigned to this class
    const assignment = await prisma.teacherClass.findFirst({
      where: { teacherId: req.user.id, classId: parseInt(classId) }
    });
    if (!assignment) return res.status(403).json({ error: 'Not assigned to this class' });

    const students = await prisma.student.findMany({
      where: { classId: parseInt(classId) }
    });
    res.json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/teacher/attendance', authenticateToken, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Access denied' });
  try {
    const { classId, attendances } = req.body; // attendances: [{studentId, status}]
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Check assignment
    const assignment = await prisma.teacherClass.findFirst({
      where: { teacherId: req.user.id, classId: parseInt(classId) }
    });
    if (!assignment) return res.status(403).json({ error: 'Not assigned to this class' });

    const attendanceDate = new Date(date);
    const attendanceRecords = attendances.map(att => ({
      studentId: att.studentId,
      date: attendanceDate,
      status: att.status
    }));

    // Delete existing attendance for today
    await prisma.attendance.deleteMany({
      where: {
        studentId: { in: attendanceRecords.map((record) => record.studentId) },
        date: attendanceDate,
      },
    });

    // Create attendance records one by one for SQLite compatibility
    const createdAttendance = [];
    for (const record of attendanceRecords) {
      const att = await prisma.attendance.create({
        data: record
      });
      createdAttendance.push(att);
    }

    res.json({ message: 'Attendance marked successfully', attendances: createdAttendance });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/attendance', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const attendance = await prisma.attendance.findMany({
      include: { student: { include: { class: true } } },
      orderBy: { date: 'desc' },
      take: 20,
    });
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/teacher/attendance/:classId', authenticateToken, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Access denied' });
  try {
    const { classId } = req.params;
    const { date } = req.query;
    const attendanceDate = date ? new Date(date) : new Date(new Date().toISOString().split('T')[0]);
    const attendance = await prisma.attendance.findMany({
      where: {
        student: { classId: parseInt(classId) },
        date: attendanceDate,
      },
      include: { student: true }
    });
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Teacher endpoints for managing classes and students
app.post('/api/teacher/classes', authenticateToken, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Access denied' });
  try {
    const { name } = req.body;

    const existingClass = await prisma.class.findUnique({ where: { name } });
    if (existingClass) {
      const existingAssignment = await prisma.teacherClass.findUnique({
        where: {
          teacherId_classId: {
            teacherId: req.user.id,
            classId: existingClass.id
          }
        }
      });

      if (existingAssignment) {
        return res.status(409).json({ error: 'Class already exists and is already assigned to you' });
      }

      await prisma.teacherClass.create({
        data: {
          teacherId: req.user.id,
          classId: existingClass.id
        }
      });

      return res.json({ message: 'Class already existed and was assigned to you', class: existingClass });
    }

    const newClass = await prisma.class.create({
      data: { name }
    });

    await prisma.teacherClass.create({
      data: {
        teacherId: req.user.id,
        classId: newClass.id
      }
    });

    res.json({ message: 'Class created and assigned successfully', class: newClass });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/teacher/students', authenticateToken, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Access denied' });
  try {
    const { classId, name, email, rollNo, parentMobileNumber } = req.body;

    // Verify teacher is assigned to this class
    const assignment = await prisma.teacherClass.findFirst({
      where: { teacherId: req.user.id, classId: parseInt(classId) }
    });
    if (!assignment) return res.status(403).json({ error: 'Not assigned to this class' });

    // Prevent duplicate roll numbers and duplicate student emails
    const existingStudentByRoll = await prisma.student.findUnique({ where: { rollNo } });
    if (existingStudentByRoll) {
      return res.status(409).json({ error: 'A student with this roll number already exists' });
    }

    const existingStudentByEmail = await prisma.student.findUnique({ where: { email } });
    if (existingStudentByEmail) {
      return res.status(409).json({ error: 'A student with this email already exists' });
    }

    const student = await prisma.student.create({
      data: {
        name,
        email,
        rollNo,
        parentMobileNumber,
        classId: parseInt(classId)
      }
    });

    res.json({ message: 'Student added successfully', student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get attendance report for a class
app.get('/api/teacher/attendance/report/:classId', authenticateToken, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Access denied' });
  try {
    const { classId } = req.params;
    const { date } = req.query;
    const attendanceDate = date ? new Date(date) : new Date(new Date().toISOString().split('T')[0]);

    // Check assignment
    const assignment = await prisma.teacherClass.findFirst({
      where: { teacherId: req.user.id, classId: parseInt(classId) }
    });
    if (!assignment) return res.status(403).json({ error: 'Not assigned to this class' });

    // Get all students in class
    const students = await prisma.student.findMany({
      where: { classId: parseInt(classId) },
      include: {
        attendances: {
          where: { date: attendanceDate }
        }
      }
    });

    // Separate present and absent
    const present = [];
    const absent = [];

    students.forEach(student => {
      const attendance = student.attendances[0];
      if (attendance && attendance.status === 'Present') {
        present.push({ id: student.id, name: student.name, rollNo: student.rollNo });
      } else {
        absent.push({ 
          id: student.id, 
          name: student.name, 
          rollNo: student.rollNo,
          parentMobileNumber: student.parentMobileNumber 
        });
      }
    });

    res.json({ date: attendanceDate, present, absent, total: students.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Send SMS to absent students' parents
app.post('/api/teacher/send-sms', authenticateToken, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Access denied' });
  try {
    const { classId, date, absentStudentIds } = req.body;

    // Check assignment
    const assignment = await prisma.teacherClass.findFirst({
      where: { teacherId: req.user.id, classId: parseInt(classId) }
    });
    if (!assignment) return res.status(403).json({ error: 'Not assigned to this class' });

    // Get absent students with parent mobile numbers
    const absentStudents = await prisma.student.findMany({
      where: { id: { in: absentStudentIds } }
    });

    if (!twilioClient || !TWILIO_PHONE) {
      if (!SMS_MOCK) {
        return res.status(500).json({
          error: 'SMS service is not configured. Add TWILIO_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE to backend/.env.'
        });
      }
    }

    const smsLog = [];
    for (const student of absentStudents) {
      if (student.parentMobileNumber) {
        const messageText = `Dear Parent, Your child ${student.name} (Roll: ${student.rollNo}) was absent today. Please contact the school for more information.`;
        const smsEntry = {
          studentName: student.name,
          parentMobile: student.parentMobileNumber,
          message: messageText,
          status: 'pending'
        };

        if (SMS_MOCK) {
          smsEntry.status = 'mocked';
          smsEntry.mock = true;
          console.log(`Mock SMS to ${student.parentMobileNumber}: ${messageText}`);
        } else {
          try {
            await twilioClient.messages.create({
              to: student.parentMobileNumber,
              from: TWILIO_PHONE,
              body: messageText
            });
            smsEntry.status = 'sent';
          } catch (smsErr) {
            smsEntry.status = 'failed';
            smsEntry.error = smsErr.message;
          }
        }

        smsLog.push(smsEntry);
      }
    }

    res.json({ message: 'SMS notification processed', smsLog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Twilio configured: ${!!twilioClient && !!TWILIO_PHONE}`);
  console.log(`SMS mock mode: ${SMS_MOCK}`);
});