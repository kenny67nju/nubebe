// Event service for managing unified events
import prisma from '../config/database.js';
import { EventFilters, PaginationParams } from '../types/index.js';
import { Prisma } from '@prisma/client';

export class EventService {
  async createEvent(eventData: any) {
    return await prisma.unifiedEvent.create({
      data: eventData,
      include: {
        client: {
          select: {
            clientCode: true,
            fullName: true,
          },
        },
      },
    });
  }

  async getEvents(filters: EventFilters = {}, pagination: PaginationParams = {}) {
    const {
      clientId,
      eventType,
      assetClass,
      complianceStatus,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      legalStructure,
      jurisdictionType,
      verificationStatus,
    } = filters;

    const {
      page = 1,
      limit = 50,
      sortBy = 'transactionTime',
      sortOrder = 'desc',
    } = pagination;

    const where: Prisma.UnifiedEventWhereInput = {};

    if (clientId) where.clientId = clientId;
    if (eventType) where.eventType = eventType as any;
    if (assetClass) where.assetClass = assetClass as any;
    if (complianceStatus) where.complianceStatus = complianceStatus as any;
    if (legalStructure) where.legalStructure = legalStructure as any;
    if (jurisdictionType) where.jurisdictionType = jurisdictionType as any;
    if (verificationStatus) where.verificationStatus = verificationStatus as any;

    if (startDate || endDate) {
      where.transactionTime = {};
      if (startDate) where.transactionTime.gte = new Date(startDate);
      if (endDate) where.transactionTime.lte = new Date(endDate);
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      where.functionalAmount = {};
      if (minAmount !== undefined) where.functionalAmount.gte = minAmount;
      if (maxAmount !== undefined) where.functionalAmount.lte = maxAmount;
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.unifiedEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          client: {
            select: {
              clientCode: true,
              fullName: true,
            },
          },
        },
      }),
      prisma.unifiedEvent.count({ where }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEventById(eventId: string) {
    return await prisma.unifiedEvent.findUnique({
      where: { id: eventId },
      include: {
        client: {
          select: {
            clientCode: true,
            fullName: true,
            email: true,
          },
        },
        linkedEvent: true,
        linkedByEvents: true,
      },
    });
  }

  async updateEvent(eventId: string, updateData: any) {
    return await prisma.unifiedEvent.update({
      where: { id: eventId },
      data: updateData,
    });
  }

  async deleteEvent(eventId: string) {
    return await prisma.unifiedEvent.delete({
      where: { id: eventId },
    });
  }

  async getEventsByClient(clientId: string) {
    return await prisma.unifiedEvent.findMany({
      where: { clientId },
      orderBy: { transactionTime: 'desc' },
    });
  }

  async getFundFlowPath(eventId: string) {
    const event = await this.getEventById(eventId);
    if (!event) return null;

    const flowPath = [];
    let currentEvent = event;

    // Trace backward
    while (currentEvent.linkedEventId) {
      const linkedEvent = await this.getEventById(currentEvent.linkedEventId);
      if (!linkedEvent) break;
      flowPath.unshift(linkedEvent);
      currentEvent = linkedEvent;
    }

    flowPath.push(event);

    // Trace forward
    const forwardEvents = await this.traceForward(eventId);
    flowPath.push(...forwardEvents);

    return flowPath;
  }

  private async traceForward(eventId: string): Promise<any[]> {
    const events = await prisma.unifiedEvent.findMany({
      where: { linkedEventId: eventId },
      include: {
        client: {
          select: {
            clientCode: true,
            fullName: true,
          },
        },
      },
    });

    const result = [];
    for (const event of events) {
      result.push(event);
      const children = await this.traceForward(event.id);
      result.push(...children);
    }

    return result;
  }
}

export default new EventService();
