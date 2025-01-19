import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { validateItem, validateEvent } from '../schemas/validation';
import { validationResult } from 'express-validator';

const router = Router();

const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', validateItem, validateRequest, asyncHandler(ItemController.createItem));
router.get('/:id', asyncHandler(ItemController.getItem));
router.put('/:id', validateItem, validateRequest, asyncHandler(ItemController.updateItem));

router.post('/:id/events', validateEvent, validateRequest, asyncHandler(ItemController.addEvent));

router.get('/:id/events', asyncHandler(ItemController.getItemEvents));
router.get('/:id/events/last', asyncHandler(ItemController.getLastEvent));

export default router;
