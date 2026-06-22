import { PrismaClient, Role, StoreStatus, ProductStatus, WarrantyType, ProductCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const adminHash = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aliadiss.com' },
    update: {},
    create: { name: 'Super Admin', email: 'admin@aliadiss.com', passwordHash: adminHash, role: Role.SUPER_ADMIN },
  })

  const ownerHash = await bcrypt.hash('seller123', 12)
  const owner = await prisma.user.upsert({
    where: { email: 'selam@aliadiss.com' },
    update: {},
    create: { name: 'Selam Tesfaye', email: 'selam@aliadiss.com', passwordHash: ownerHash, role: Role.STORE_OWNER },
  })

  const buyerHash = await bcrypt.hash('buyer123', 12)
  await prisma.user.upsert({
    where: { email: 'yonas@aliadiss.com' },
    update: {},
    create: { name: 'Yonas Kebede', email: 'yonas@aliadiss.com', passwordHash: buyerHash, role: Role.CUSTOMER },
  })

  const store = await prisma.store.upsert({
    where: { ownerId: owner.id },
    update: {},
    create: {
      name: 'TechHub Addis', description: 'Premium tech store in Addis Ababa with official warranties.',
      legalName: 'TechHub Addis PLC', legalCredentials: 'Business license #AA-10291, TIN verified',
      city: 'Addis Ababa', address: 'Bole, Addis Ababa', status: StoreStatus.APPROVED,
      ownerId: owner.id,
    },
  })

  const products = [
    { title: 'iPhone 15 Pro 256GB', description: 'Latest Apple flagship with titanium design, A17 Pro chip.', category: ProductCategory.PHONE, priceBirr: 189999, warrantyType: WarrantyType.OFFICIAL, warrantyMonths: 12, status: ProductStatus.VERIFIED, featured: true, stock: 5, ramGb: '8', cameraMp: '48+12+12', batteryMah: '3274', processorType: 'A17 Pro', screenSizeIn: '6.1', screenResolution: '2556x1179', storageGb: '256' },
    { title: 'Samsung Galaxy S24 Ultra', description: 'Galaxy AI flagship with built-in S Pen and 200MP camera.', category: ProductCategory.PHONE, priceBirr: 179999, warrantyType: WarrantyType.OFFICIAL, warrantyMonths: 12, status: ProductStatus.VERIFIED, featured: true, stock: 3, ramGb: '12', cameraMp: '200+12+10+12', batteryMah: '5000', processorType: 'Snapdragon 8 Gen 3', screenSizeIn: '6.8', screenResolution: '3088x1440', storageGb: '256' },
    { title: 'MacBook Pro 14" M3', description: 'Apple M3 chip, stunning Liquid Retina XDR display.', category: ProductCategory.LAPTOP, priceBirr: 289999, warrantyType: WarrantyType.OFFICIAL, warrantyMonths: 12, status: ProductStatus.VERIFIED, featured: false, stock: 2, ramGb: '18', cameraMp: '12', batteryMah: '70000', processorType: 'Apple M3', screenSizeIn: '14.2', screenResolution: '3024x1964', storageGb: '512' },
    { title: 'Xiaomi 14 Pro', description: 'Leica-tuned cameras, Snapdragon 8 Gen 3, 120W HyperCharge.', category: ProductCategory.PHONE, priceBirr: 134999, warrantyType: WarrantyType.SELLER, warrantyMonths: 6, status: ProductStatus.VERIFIED, featured: false, stock: 8, ramGb: '12', cameraMp: '50+50+50', batteryMah: '4880', processorType: 'Snapdragon 8 Gen 3', screenSizeIn: '6.73', screenResolution: '3200x1440', storageGb: '256' },
    { title: 'AirPods Pro 2nd Gen', description: 'Active noise cancellation, spatial audio, USB-C case.', category: ProductCategory.ACCESSORY, priceBirr: 34999, warrantyType: WarrantyType.OFFICIAL, warrantyMonths: 12, status: ProductStatus.VERIFIED, featured: false, stock: 15, ramGb: '', cameraMp: '', batteryMah: '30', processorType: 'H2 chip', screenSizeIn: '', screenResolution: '', storageGb: '' },
  ]

  for (const p of products) {
    await prisma.product.create({ data: { ...p, storeId: store.id } })
  }

  console.log('Seed complete!')
  console.log('Admin: admin@aliadiss.com / admin123')
  console.log('Seller: selam@aliadiss.com / seller123')
  console.log('Buyer: yonas@aliadiss.com / buyer123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
