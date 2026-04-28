const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const stores = await prisma.store.findMany();
  console.log('STORES:', JSON.stringify(stores, null, 2));

  const users = await prisma.user.findMany({ select: { id: true, username: true, role: true, storeId: true } });
  console.log('USERS:', JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
