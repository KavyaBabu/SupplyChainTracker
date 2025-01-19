import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { FileDB } from '../utils/fileDB';
import { Item } from '../models/Item';
import { Event as ItemEvent } from '../models/Event';

export class ItemController {
  static async createItem(req: Request, res: Response) {
    try {
      const db = await FileDB.getInstance();
      const newItem: Item = {
        id: uuidv4(),
        name: req.body.name,
        description: req.body.description,
        color: req.body.color,
        price: req.body.price,
        createdAt: new Date(),
        updatedAt: new Date(),
        events: []
      };

      const item = await db.createItem(newItem);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create item' });
    }
  }

  static async getItem(req: Request, res: Response) {
    try {
      const db = await FileDB.getInstance();
      const item = await db.getItem(req.params.id);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  }

  static async updateItem(req: Request, res: Response) {
    try {
      const db = await FileDB.getInstance();
      const item = await db.getItem(req.params.id);
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      const updatedItem = await db.updateItem(req.params.id, req.body);
  
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  }

  static async addEvent(req: Request, res: Response) {
    try {
      const db = await FileDB.getInstance();
      const newEvent: ItemEvent = {
        id: uuidv4(),
        itemId: req.params.id,
        type: req.body.type,
        location: req.body.location,
        custodian: req.body.custodian,
        status: req.body.status,
        timestamp: new Date(),
        notes: req.body.notes
      };
  
      const updatedItem = await db.addEvent(req.params.id, newEvent);
  
      if (!updatedItem) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      res.json(updatedItem);
    } catch (error) {
      console.error('Error adding event:', error);
      res.status(500).json({ error: 'Failed to add event' });
    }
  }

  static async getItemEvents(req: Request, res: Response) {
    try {
      const db = await FileDB.getInstance();
      const item = await db.getItem(req.params.id);
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      res.json(item.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to get item events' });
    }
  }
  
  static async getLastEvent(req: Request, res: Response) {
    try {
      const db = await FileDB.getInstance();
      const item = await db.getItem(req.params.id);
  
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      const lastEvent = item.events[item.events.length - 1];
  
      if (!lastEvent) {
        return res.status(404).json({ error: 'No events found for this item' });
      }
  
      res.json(lastEvent);
    } catch (error) {
      console.error('Error fetching last event:', error);
      res.status(500).json({ error: 'Failed to get last event' });
    }
  }
  static async getAllItems(req: Request, res: Response) {
    try {
      const db = await FileDB.getInstance();
      const items = await db.getAllItems();
  
      res.json(items);
    } catch (error) {
      console.error('Error fetching all items:', error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  }
  
  
}
