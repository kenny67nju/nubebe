// Client service for managing client data
import prisma from '../config/database.js';

export class ClientService {
  async createClient(clientData: any) {
    return await prisma.client.create({
      data: clientData,
      include: {
        advisor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getClients(advisorId?: string) {
    const where = advisorId ? { advisorId } : {};

    return await prisma.client.findMany({
      where,
      include: {
        advisor: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            events: true,
            bioEvents: true,
            entities: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getClientById(clientId: string) {
    return await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        advisor: {
          select: {
            name: true,
            email: true,
          },
        },
        events: {
          orderBy: { transactionTime: 'desc' },
          take: 10,
        },
        bioEvents: {
          orderBy: { occurrenceDate: 'desc' },
        },
        entities: {
          include: {
            governanceEvents: {
              orderBy: { resolutionDate: 'desc' },
              take: 5,
            },
          },
        },
      },
    });
  }

  async updateClient(clientId: string, updateData: any) {
    return await prisma.client.update({
      where: { id: clientId },
      data: updateData,
    });
  }

  async deleteClient(clientId: string) {
    return await prisma.client.delete({
      where: { id: clientId },
    });
  }

  async getClientStats(clientId: string) {
    const [events, bioEvents, entities] = await Promise.all([
      prisma.unifiedEvent.findMany({
        where: { clientId },
      }),
      prisma.bioIdentityEvent.count({
        where: { clientId },
      }),
      prisma.legalEntity.count({
        where: { clientId },
      }),
    ]);

    const totalAssets = events.reduce((sum, e) => sum + e.functionalAmount, 0);
    const totalEvents = events.length;

    const assetsByClass = events.reduce((acc, e) => {
      acc[e.assetClass] = (acc[e.assetClass] || 0) + e.functionalAmount;
      return acc;
    }, {} as Record<string, number>);

    const assetsByJurisdiction = events.reduce((acc, e) => {
      acc[e.sourceCountry] = (acc[e.sourceCountry] || 0) + e.functionalAmount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAssets,
      totalEvents,
      bioEvents,
      entities,
      assetsByClass,
      assetsByJurisdiction,
    };
  }
}

export default new ClientService();
