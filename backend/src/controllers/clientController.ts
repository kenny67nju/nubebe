// Client controller
import { Request, Response, NextFunction } from 'express';
import clientService from '../services/clientService.js';

export class ClientController {
  async createClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await clientService.createClient(req.body);

      res.status(201).json({
        success: true,
        data: client,
        message: 'Client created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getClients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const advisorId = req.query.advisorId as string | undefined;
      const clients = await clientService.getClients(advisorId);

      res.json({
        success: true,
        data: clients,
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await clientService.getClientById(req.params.id);

      if (!client) {
        res.status(404).json({
          success: false,
          error: 'Client not found',
        });
        return;
      }

      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await clientService.updateClient(req.params.id, req.body);

      res.json({
        success: true,
        data: client,
        message: 'Client updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteClient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await clientService.deleteClient(req.params.id);

      res.json({
        success: true,
        message: 'Client deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await clientService.getClientStats(req.params.id);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ClientController();
