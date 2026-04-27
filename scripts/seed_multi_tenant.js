const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default store for local development...');

  const domain = 'localhost';
  const name = 'Local Default Store';
  
  let store = await prisma.store.findUnique({ where: { domain } });
  
  if (!store) {
    store = await prisma.store.create({
      data: {
        name,
        domain,
        themeColor: '#000000',
      }
    });
    console.log('Created default store:', store.name);
  } else {
    console.log('Default store already exists.');
  }

  // Create a master admin if not exists
  const masterUsername = 'superadmin';
  let master = await prisma.user.findUnique({ where: { username: masterUsername } });
  
  if (!master) {
    const hashedPassword = crypto.createHash('sha256').update('password').digest('hex');
    master = await prisma.user.create({
      data: {
        username: masterUsername,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      }
    });
    console.log('Created master admin: superadmin / password');
  }

  // Also create an admin for the store
  const storeUsername = 'admin';
  let storeAdmin = await prisma.user.findUnique({ where: { username: storeUsername } });
  
  if (!storeAdmin) {
    const hashedPassword = crypto.createHash('sha256').update('password').digest('hex');
    storeAdmin = await prisma.user.create({
      data: {
        username: storeUsername,
        password: hashedPassword,
        role: 'STORE_ADMIN',
        storeId: store.id,
      }
    });
    console.log('Created store admin: admin / password');
  }

  // Seed sample products and categories
  const categoryCount = await prisma.category.count({ where: { storeId: store.id } });
  if (categoryCount === 0) {
    const category = await prisma.category.create({
      data: {
        name: 'Luxury Watches',
        slug: 'luxury-watches',
        storeId: store.id
      }
    });

    const product1 = await prisma.product.create({
      data: {
        name: 'Rolex Submariner Date',
        description: 'The Rolex Submariner Date is a classic dive watch.',
        actualPrice: 12000,
        sellingPrice: 11500,
        stock: 10,
        isVisible: true,
        isTrending: true,
        storeId: store.id,
        categoryId: category.id,
      }
    });

    await prisma.productImage.create({
      data: {
        url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=600',
        isPrimary: true,
        productId: product1.id
      }
    });

    const product2 = await prisma.product.create({
      data: {
        name: 'Omega Speedmaster',
        description: 'The first watch worn on the moon.',
        actualPrice: 8000,
        sellingPrice: 7800,
        stock: 5,
        isVisible: true,
        isTrending: true,
        storeId: store.id,
        categoryId: category.id,
      }
    });

    await prisma.productImage.create({
      data: {
        url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=600',
        isPrimary: true,
        productId: product2.id
      }
    });
    
    console.log('Seeded sample products.');
  }

  // Seed Hero Images
  const heroCount = await prisma.heroSliderImage.count({ where: { storeId: store.id } });
  if (heroCount === 0) {
    await prisma.heroSliderImage.create({
      data: {
        url: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=2000',
        order: 1,
        storeId: store.id
      }
    });
    await prisma.heroSliderImage.create({
      data: {
        url: 'https://images.unsplash.com/photo-1542496658-e32675242852?auto=format&fit=crop&q=80&w=2000',
        order: 2,
        storeId: store.id
      }
    });
    console.log('Seeded hero images.');
  }

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
