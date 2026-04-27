import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { username } });

  if (!existing) {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    });
    console.log(`Admin user created: ${username} with password match to .env or 'admin123'`);
  } else {
    // Update password if changed in env
    await prisma.user.update({
      where: { username },
      data: { password: hashedPassword, role: 'SUPER_ADMIN' }
    });
    console.log(`Admin user '${username}' updated to new password.`);
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
