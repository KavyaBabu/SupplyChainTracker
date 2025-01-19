import { body } from 'express-validator';

export const validateItem = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('color').optional().isString().withMessage('Color must be a string'),
  body('price').optional().isNumeric().withMessage('Price must be a number')
];

export const validateEvent = [
  body('type')
    .notEmpty().withMessage('Event type is required')
    .isIn(['LOCATION_UPDATE', 'CUSTODIAN_CHANGE', 'STATUS_UPDATE'])
    .withMessage('Invalid event type. Allowed values: LOCATION_UPDATE, CUSTODIAN_CHANGE, STATUS_UPDATE'),
  body('location').optional().isString().withMessage('Location must be a string'),
  body('custodian').optional().isString().withMessage('Custodian must be a string'),
  body('status').optional().isString().withMessage('Status must be a string'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];
