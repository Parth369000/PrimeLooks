const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sourceDir = "C:\\Users\\nemis\\.gemini\\antigravity\\brain\\20c34318-cf76-4925-b91f-18dc58325199";
  const targetDir = path.join(__dirname, 'public', 'images', 'slider');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const filesToCopy = [
    'watch_silver_minimalist_1777111823992.png',
    'watch_gold_chrono_1777111840301.png',
    'watch_rose_gold_1777111855946.png',
    'watch_tactical_black_1777111873655.png',
    'watch_vintage_skeleton_1777111889826.png'
  ];

  const dbEntries = [];
  let order = 1;

  for (const file of filesToCopy) {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(targetDir, file);
    
    // Copy the file
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to public/images/slider/`);
    
    // Prep the URL path
    dbEntries.push({
      url: `/images/slider/${file}`,
      order: order++
    });
  }

  // Inject into database
  await prisma.heroSliderImage.deleteMany({}); // clear any old images
  await prisma.heroSliderImage.createMany({
    data: dbEntries
  });

  console.log('Successfully injected 5 luxury watch images into the Storefront Hero database!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
