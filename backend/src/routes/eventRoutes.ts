// Event routes
import { Router } from 'express';
import eventController from '../controllers/eventController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Private (ADMIN, ADVISOR)
 */
router.post('/', authorize('ADMIN', 'ADVISOR'), eventController.createEvent.bind(eventController));

/**
 * @route   GET /api/events
 * @desc    Get all events with filters and pagination
 * @access  Private
 */
router.get('/', eventController.getEvents.bind(eventController));

/**
 * @route   GET /api/events/risk-metrics
 * @desc    Get risk metrics for events
 * @access  Private
 */
router.get('/risk-metrics', eventController.getRiskMetrics.bind(eventController));

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Private
 */
router.get('/:id', eventController.getEventById.bind(eventController));

/**
 * @route   PUT /api/events/:id
 * @desc    Update event
 * @access  Private (ADMIN, ADVISOR)
 */
router.put('/:id', authorize('ADMIN', 'ADVISOR'), eventController.updateEvent.bind(eventController));

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private (ADMIN)
 */
router.delete('/:id', authorize('ADMIN'), eventController.deleteEvent.bind(eventController));

/**
 * @route   GET /api/events/:id/flow-path
 * @desc    Get fund flow path for an event
 * @access  Private
 */
router.get('/:id/flow-path', eventController.getFundFlowPath.bind(eventController));

/**
 * @route   GET /api/events/client/:clientId
 * @desc    Get all events for a client
 * @access  Private
 */
router.get('/client/:clientId', eventController.getClientEvents.bind(eventController));

export default router;
