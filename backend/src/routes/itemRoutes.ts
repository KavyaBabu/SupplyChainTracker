import { Router } from 'express';
import { ItemController } from '../controllers/itemController';

const router = Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  
router.post('/', asyncHandler(ItemController.createItem));
router.get('/:id', asyncHandler(ItemController.getItem));
router.put('/:id', asyncHandler(ItemController.updateItem));

router.post('/:id/events', asyncHandler(ItemController.addEvent));

router.get('/:id/events', asyncHandler(ItemController.getItemEvents));
router.get('/:id/events/last', asyncHandler(ItemController.getLastEvent));


export default router;