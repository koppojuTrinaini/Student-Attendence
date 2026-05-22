const http = require('http');
const { PrismaClient } = require('@prisma/client');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InRlYWNoZXIiLCJpYXQiOjE3Nzg5MTkzMzR9.tDT3bW1xbr0_wKFDRqk5Vz7ccnntrnvXGw7UNSsSpeo';

async function upsertStudent() {
  const prisma = new PrismaClient();
  const student = await prisma.student.upsert({
    where: { email: 'naini824@sasi.ac.in' },
    update: {
      name: 'nainia',
      rollNo: '01-824',
      parentMobileNumber: '+918247457887',
      classId: 1
    },
    create: {
      name: 'nainia',
      email: 'naini824@sasi.ac.in',
      rollNo: '01-824',
      parentMobileNumber: '+918247457887',
      classId: 1
    }
  });
  await prisma.$disconnect();
  console.log('STUDENT_CREATED', JSON.stringify(student));
  return student.id;
}

function sendSms(studentId) {
  const data = JSON.stringify({
    classId: 1,
    date: '2026-05-16',
    absentStudentIds: [studentId]
  });

  const opts = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/teacher/send-sms',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      Authorization: `Bearer ${token}`
    }
  };

  const req = http.request(opts, (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log('SMS_RESPONSE', body);
    });
  });

  req.on('error', (err) => {
    console.error('REQUEST_ERROR', err);
  });

  req.write(data);
  req.end();
}

async function main() {
  const studentId = await upsertStudent();
  sendSms(studentId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
