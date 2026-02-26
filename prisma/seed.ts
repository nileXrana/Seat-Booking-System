import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const firstNames = ['Rahul', 'John', 'Priya', 'Sarah', 'Amit', 'Emma', 'Vikram', 'Michael', 'Sneha', 'David', 'Anjali', 'James', 'Rohan', 'Emily', 'Kavya', 'William', 'Arjun', 'Olivia', 'Neha', 'Daniel']
const lastNames = ['Sharma', 'Doe', 'Patel', 'Smith', 'Singh', 'Johnson', 'Kumar', 'Brown', 'Verma', 'Davis', 'Gupta', 'Miller', 'Reddy', 'Wilson', 'Iyer', 'Moore', 'Das', 'Taylor', 'Nair', 'Anderson']

function getRandomName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)]
  const l = lastNames[Math.floor(Math.random() * lastNames.length)]
  return `${f} ${l}`
}

async function main() {
  console.log('Clearing old data...')
  const bookings = await prisma.booking.findMany()
  for (const b of bookings) {
    await prisma.booking.delete({ where: { id: b.id } })
  }
  const users = await prisma.user.findMany()
  for (const u of users) {
    await prisma.user.delete({ where: { id: u.id } })
  }

  console.log('Generating B1 Users...')
  const b1Users = Array.from({ length: 40 }).map((_, i) => ({
    email: `b1@wissen${String(i + 1).padStart(2, '0')}`,
    name: getRandomName(),
    password: '12345678', // Plain text for simplicity as requested for MVP
    batch: 'B1'
  }))

  console.log('Generating B2 Users...')
  const b2Users = Array.from({ length: 40 }).map((_, i) => ({
    email: `b2@wissen${String(i + 1).padStart(2, '0')}`,
    name: getRandomName(),
    password: '12345678',
    batch: 'B2'
  }))

  console.log('Inserting 80 users...')
  for (const user of [...b1Users, ...b2Users]) {
    await prisma.user.create({ data: user })
  }

  console.log('Seeded 80 users successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
