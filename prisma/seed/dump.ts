import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.createMany({
    data: [
      {
        username: 'Test',
        firstName: 'Test',
        balance: 5000000,
      },
      {
        username: 'Test2',
        firstName: 'Test2',
        balance: 2000000,
      },
      {
        username: 'Test3',
        firstName: 'Test3',
        balance: 4000000,
      }
    ]
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
