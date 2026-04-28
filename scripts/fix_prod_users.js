const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  // Link admin user to primelooks.in store
  const store = await prisma.store.findUnique({ where: { domain: 'primelooks.in' } });
  if (!store) {
    console.log('ERROR: primelooks.in store not found!');
    return;
  }

  // Update admin user - link to store and ensure correct password hash
  const hashedPassword = crypto.createHash('sha256').update('password').digest('hex');
  await prisma.user.update({
    where: { username: 'admin' },
    data: { storeId: store.id, password: hashedPassword, role: 'STORE_ADMIN' }
  });
  console.log(`Linked admin user to store: ${store.name} (${store.domain}), storeId: ${store.id}`);

  // Also ensure superadmin has correct hash
  await prisma.user.update({
    where: { username: 'superadmin' },
    data: { password: hashedPassword }
  });
  console.log('Updated superadmin password hash');
}

main().catch(console.error).finally(() => prisma.$disconnect());
