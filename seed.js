const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@school.com',
      password: adminPassword,
    },
  });

  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const teacher = await prisma.teacher.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      name: 'Ava Peters',
      email: 'teacher@school.com',
      password: teacherPassword,
    },
  });

  const classA = await prisma.class.upsert({
    where: { name: '10th Grade - A' },
    update: {},
    create: { name: '10th Grade - A' },
  });

  const classB = await prisma.class.upsert({
    where: { name: '10th Grade - B' },
    update: {},
    create: { name: '10th Grade - B' },
  });

  await prisma.teacherClass.upsert({
    where: { teacherId_classId: { teacherId: teacher.id, classId: classA.id } },
    update: {},
    create: { teacherId: teacher.id, classId: classA.id },
  });

  const studentData = [
    { name: 'Emma Johnson', email: 'emma.johnson@example.com', rollNo: '10A001', parentMobileNumber: '+91 98765 43210', classId: classA.id },
    { name: 'Liam Walker', email: 'liam.walker@example.com', rollNo: '10A002', parentMobileNumber: '+91 98765 43211', classId: classA.id },
    { name: 'Olivia Brown', email: 'olivia.brown@example.com', rollNo: '10A003', parentMobileNumber: '+91 98765 43212', classId: classA.id },
    { name: 'Noah Davis', email: 'noah.davis@example.com', rollNo: '10B001', parentMobileNumber: '+91 98765 43213', classId: classB.id },
    { name: 'Ava Wilson', email: 'ava.wilson@example.com', rollNo: '10B002', parentMobileNumber: '+91 98765 43214', classId: classB.id },
  ];

  for (const student of studentData) {
    await prisma.student.upsert({
      where: { email: student.email },
      update: {},
      create: student,
    });
  }

  const attendanceData = [
    { studentId: 1, date: new Date('2026-05-13'), status: 'Present' },
    { studentId: 2, date: new Date('2026-05-13'), status: 'Absent' },
    { studentId: 3, date: new Date('2026-05-13'), status: 'Present' },
  ];

  for (const attendance of attendanceData) {
    await prisma.attendance.create({
      data: attendance,
    }).catch(() => {
      // Skip if record already exists
    });
  }

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });