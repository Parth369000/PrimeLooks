const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.store.upsert({
    where: { domain: 'primelooks.in' },
    update: {},
    create: { name: 'PrimeLooks IN', domain: 'primelooks.in', themeColor: '#000000' }
  });
  console.log('Added primelooks.in store to DB');
}
main().catch(console.error).finally(() => prisma.$disconnect());
