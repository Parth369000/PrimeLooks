require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.admin.findUnique({ where: { username } });

  if (!existing) {
    await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    console.log(`Admin user created: ${username}`);
  } else {
    // Update password if changed in env
    await prisma.admin.update({
      where: { username },
      data: { password: hashedPassword }
    });
    console.log(`Admin user '${username}' updated.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
