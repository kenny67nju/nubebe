// Client routes
import { Router } from 'express';
import clientController from '../controllers/clientController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/clients
 * @desc    Create a new client
 * @access  Private (ADMIN, ADVISOR)
 */
router.post('/', authorize('ADMIN', 'ADVISOR'), clientController.createClient.bind(clientController));

/**
 * @route   GET /api/clients
 * @desc    Get all clients
 * @access  Private
 */
router.get('/', clientController.getClients.bind(clientController));

/**
 * @route   GET /api/clients/:id
 * @desc    Get client by ID
 * @access  Private
 */
router.get('/:id', clientController.getClientById.bind(clientController));

/**
 * @route   PUT /api/clients/:id
 * @desc    Update client
 * @access  Private (ADMIN, ADVISOR)
 */
router.put('/:id', authorize('ADMIN', 'ADVISOR'), clientController.updateClient.bind(clientController));

/**
 * @route   DELETE /api/clients/:id
 * @desc    Delete client
 * @access  Private (ADMIN)
 */
router.delete('/:id', authorize('ADMIN'), clientController.deleteClient.bind(clientController));

/**
 * @route   GET /api/clients/:id/stats
 * @desc    Get client statistics
 * @access  Private
 */
router.get('/:id/stats', clientController.getClientStats.bind(clientController));

export default router;
