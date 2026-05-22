const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function normalize() {
  const students = await prisma.student.findMany();
  let updated = 0;
  for (const s of students) {
    if (!s.parentMobileNumber) continue;
    const original = s.parentMobileNumber;
    // Keep leading + and digits only
    const normalized = original.replace(/[^+0-9]/g, '');
    if (normalized !== original) {
      await prisma.student.update({ where: { id: s.id }, data: { parentMobileNumber: normalized } });
      console.log(`Updated student ${s.email}: '${original}' -> '${normalized}'`);
      updated++;
    }
  }
  console.log(`Done. ${updated} numbers updated.`);
}

normalize()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
