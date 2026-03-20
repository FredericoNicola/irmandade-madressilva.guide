import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('changeme123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@madressilva.guide' },
    update: {},
    create: {
      email: 'admin@madressilva.guide',
      name: 'Admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin user created: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
