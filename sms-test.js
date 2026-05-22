const http = require('http');
const { PrismaClient } = require('@prisma/client');

async function findNumber(number) {
  const prisma = new PrismaClient();
  const student = await prisma.student.findFirst({ where: { parentMobileNumber: number } });
  await prisma.$disconnect();
  console.log('STUDENT_RECORD', student ? JSON.stringify(student) : 'NOT_FOUND');
}

async function main() {
  await findNumber('+918247457887');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
