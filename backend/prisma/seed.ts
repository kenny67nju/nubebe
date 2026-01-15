// Database seed file
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.unifiedEvent.deleteMany();
  await prisma.bioIdentityEvent.deleteMany();
  await prisma.entityGovernanceEvent.deleteMany();
  await prisma.legalEntity.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@nubebe.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const advisorUser = await prisma.user.create({
    data: {
      email: 'advisor@nubebe.com',
      password: hashedPassword,
      name: 'Wealth Advisor',
      role: 'ADVISOR',
    },
  });

  console.log('✅ Created users');

  // Create client
  const client = await prisma.client.create({
    data: {
      clientCode: 'CLIENT_001',
      fullName: 'Vincent Zhang',
      email: 'vincent@example.com',
      phone: '+86 138 0000 0000',
      nationality: ['CN', 'US'],
      taxResidency: ['CN', 'US'],
      riskLevel: 'MEDIUM',
      advisorId: advisorUser.id,
    },
  });

  console.log('✅ Created client');

  // Create sample events
  const event1 = await prisma.unifiedEvent.create({
    data: {
      eventId: 'evt_001',
      clientId: client.id,
      eventType: 'TRADE_SELL',
      assetClass: 'SECURITY',
      transactionTime: new Date('2024-06-01T09:30:00Z'),
      postingDate: new Date('2024-06-01'),
      assetName: 'Tencent (00700)',
      institutionName: 'CMBI',
      accountId: 'CMBI_I108002',
      quantity: 10000,
      price: 385,
      grossAmount: 3850000,
      netAmount: 3850000,
      currency: 'HKD',
      functionalAmount: 3500000,
      legalStructure: 'INDIVIDUAL',
      sourceCountry: 'HK',
      jurisdictionType: 'OFFSHORE',
      verificationStatus: 'VERIFIED',
      cashFlowNature: 'CAPITAL_MOVEMENT',
      complianceStatus: 'COMPLIANT',
      purposeCategory: 'INVESTMENT',
      fundFlowPath: ['evt_001'],
      remark: 'Sell Tencent stock',
    },
  });

  const event2 = await prisma.unifiedEvent.create({
    data: {
      eventId: 'evt_inc_001',
      clientId: client.id,
      eventType: 'INCOME',
      assetClass: 'CASH',
      transactionTime: new Date('2024-05-15T10:00:00Z'),
      postingDate: new Date('2024-05-15'),
      assetName: 'Monthly Salary',
      institutionName: 'Nubebe Tech Ltd',
      accountId: 'CIB_MAIN',
      quantity: 1,
      price: 150000,
      grossAmount: 150000,
      netAmount: 105000,
      currency: 'CNY',
      functionalAmount: 150000,
      legalStructure: 'INDIVIDUAL',
      sourceCountry: 'CN',
      jurisdictionType: 'ONSHORE',
      verificationStatus: 'VERIFIED',
      complianceStatus: 'COMPLIANT',
      fundFlowPath: ['evt_inc_001'],
      remark: 'Monthly salary after tax',
    },
  });

  const event3 = await prisma.unifiedEvent.create({
    data: {
      eventId: 'evt_xborder_edu',
      clientId: client.id,
      eventType: 'TRANSFER_OUT',
      assetClass: 'CASH',
      transactionTime: new Date('2024-04-20T14:30:00Z'),
      postingDate: new Date('2024-04-20'),
      settleDate: new Date('2024-04-22'),
      assetName: 'USD Wire Transfer',
      institutionName: 'CIB Shanghai',
      accountId: 'CIB_MAIN',
      quantity: 1,
      price: 50000,
      grossAmount: 50000,
      netAmount: 49800,
      currency: 'USD',
      functionalAmount: 360000,
      counterpartyName: 'Harvard University',
      legalStructure: 'INDIVIDUAL',
      sourceCountry: 'US',
      jurisdictionType: 'LONG_ARM',
      verificationStatus: 'VERIFIED',
      cashFlowNature: 'MAINTENANCE_OUT',
      complianceStatus: 'COMPLIANT',
      purposeCategory: 'EDUCATION',
      projectTags: ['Harvard_Tuition', 'Education_2024'],
      fundFlowPath: ['evt_xborder_edu'],
      remark: 'Tuition payment for Harvard University',
    },
  });

  console.log('✅ Created sample events');

  // Create bio event
  await prisma.bioIdentityEvent.create({
    data: {
      eventId: 'bio_001',
      clientId: client.id,
      eventType: 'TAX_RESIDENCY_CHANGE',
      occurrenceDate: new Date('2024-01-01'),
      jurisdiction: 'US',
      documentNumber: 'W8-BEN-2024-001',
      documentType: 'W8-BEN',
      expiryDate: new Date('2026-12-31'),
      status: 'ACTIVE',
      remark: 'Updated tax residency status',
    },
  });

  console.log('✅ Created bio-identity events');

  // Create legal entity
  const entity = await prisma.legalEntity.create({
    data: {
      entityId: 'ENT_001',
      entityName: 'Zhang Family Trust',
      entityType: 'TRUST',
      jurisdiction: 'BVI',
      incorporationDate: new Date('2023-06-15'),
      governingLaw: 'British Virgin Islands Trust Act',
      clientId: client.id,
    },
  });

  await prisma.entityGovernanceEvent.create({
    data: {
      eventId: 'gov_001',
      entityId: entity.id,
      eventType: 'TRUST_SETTLEMENT',
      resolutionDate: new Date('2023-06-15'),
      resolutionNumber: 'TS-2023-001',
      signatory: 'Vincent Zhang',
      affectedStakeholders: ['Vincent Zhang', 'Zhang Family Members'],
      complianceTags: ['BVI_Trust', 'Asset_Protection'],
      remark: 'Initial trust settlement',
    },
  });

  console.log('✅ Created legal entities and governance events');

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📧 Test credentials:');
  console.log('   Admin: admin@nubebe.com / password123');
  console.log('   Advisor: advisor@nubebe.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
