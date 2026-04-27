const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const store = await prisma.store.findFirst({
    where: { domain: 'fashion.com' }
  });

  if (store) {
    await prisma.store.update({
      where: { id: store.id },
      data: { domain: 'fashion.localhost' }
    });
    console.log('Successfully updated domain to fashion.localhost');
  } else {
    console.log('Store fashion.com not found');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
