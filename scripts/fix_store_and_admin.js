const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  // 1. Fix admin password to use sha256 so login works
  const hashedPassword = crypto.createHash('sha256').update('password').digest('hex');
  await prisma.user.updateMany({
    where: { username: 'admin' },
    data: { password: hashedPassword, role: 'STORE_ADMIN' }
  });
  console.log('Fixed admin user password (now uses sha256 of "password")');

  // 2. Create primelooks store
  const domains = ['primelooks.localhost', 'primelooks', 'primelooks.com'];
  
  for (const domain of domains) {
    let store = await prisma.store.findUnique({ where: { domain } });
    if (!store) {
      store = await prisma.store.create({
        data: {
          name: 'PrimeLooks',
          domain: domain,
          themeColor: '#0f172a',
        }
      });
      console.log(`Created store with domain: ${domain}`);
    } else {
      console.log(`Store with domain ${domain} already exists`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
