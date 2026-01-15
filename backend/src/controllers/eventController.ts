// Event controller
import { Request, Response, NextFunction } from 'express';
import eventService from '../services/eventService.js';
import { calculateRiskMetrics, assessEventRisk } from '../utils/riskCalculator.js';

export class EventController {
  async createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = await eventService.createEvent(req.body);

      res.status(201).json({
        success: true,
        data: event,
        message: 'Event created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        clientId: req.query.clientId as string,
        eventType: req.query.eventType as string,
        assetClass: req.query.assetClass as string,
        complianceStatus: req.query.complianceStatus as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        minAmount: req.query.minAmount ? parseFloat(req.query.minAmount as string) : undefined,
        maxAmount: req.query.maxAmount ? parseFloat(req.query.maxAmount as string) : undefined,
        legalStructure: req.query.legalStructure as string,
        jurisdictionType: req.query.jurisdictionType as string,
        verificationStatus: req.query.verificationStatus as string,
      };

      const pagination = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        sortBy: (req.query.sortBy as string) || 'transactionTime',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };

      const result = await eventService.getEvents(filters, pagination);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = await eventService.getEventById(req.params.id);

      if (!event) {
        res.status(404).json({
          success: false,
          error: 'Event not found',
        });
        return;
      }

      const riskScore = assessEventRisk(event);

      res.json({
        success: true,
        data: {
          ...event,
          riskScore,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);

      res.json({
        success: true,
        data: event,
        message: 'Event updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await eventService.deleteEvent(req.params.id);

      res.json({
        success: true,
        message: 'Event deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const events = await eventService.getEventsByClient(req.params.clientId);

      res.json({
        success: true,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRiskMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientId = req.query.clientId as string | undefined;
      const filters = clientId ? { clientId } : {};

      const { events } = await eventService.getEvents(filters, { limit: 10000 });
      const riskMetrics = calculateRiskMetrics(events);

      res.json({
        success: true,
        data: riskMetrics,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFundFlowPath(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const flowPath = await eventService.getFundFlowPath(req.params.id);

      if (!flowPath) {
        res.status(404).json({
          success: false,
          error: 'Event not found',
        });
        return;
      }

      res.json({
        success: true,
        data: flowPath,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EventController();
