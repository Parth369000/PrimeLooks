const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetDir = path.join(__dirname, '..', 'public', 'images', 'slider');

  const files = fs.readdirSync(targetDir);
  const dbEntries = [];
  let order = 1;

  for (const file of files) {
    if (!file.endsWith('.png')) continue;
    
    // Add a unique timestamp suffix to bypass Next.js Image caching
    const newFileName = file.replace('.png', '_v2.png');
    
    const srcPath = path.join(targetDir, file);
    const destPath = path.join(targetDir, newFileName);
    
    fs.renameSync(srcPath, destPath);
    console.log(`Renamed to ${newFileName}`);
    
    // Prep the URL path
    dbEntries.push({
      url: `/images/slider/${newFileName}`,
      order: order++
    });
  }

  // Inject into database
  await prisma.heroSliderImage.deleteMany({}); 
  await prisma.heroSliderImage.createMany({
    data: dbEntries
  });

  console.log('Successfully cache-busted 5 luxury watch images in the Storefront!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
