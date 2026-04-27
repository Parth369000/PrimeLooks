import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { HeaderInteractive } from './HeaderInteractive';

interface HeaderProps {
  storeId: number;
  storeName: string;
  logoUrl: string | null;
}

export const Header = async ({ storeId, storeName, logoUrl }: HeaderProps) => {
  const categories = await prisma.category.findMany({
    where: { storeId },
    take: 5,
  });

  return <HeaderInteractive categories={categories} storeName={storeName} logoUrl={logoUrl} />;
};
