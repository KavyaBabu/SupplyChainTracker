import fs from 'fs/promises';
import path from 'path';
import { Item } from '../models/Item';

const DB_PATH = path.join(__dirname, '../../data/SupplyChainItems.json');

export class FileDB {
  private static instance: FileDB;
  private items: Map<string, Item>;

  private constructor() {
    this.items = new Map();
  }

  static async getInstance(): Promise<FileDB> {
    if (!FileDB.instance) {
      FileDB.instance = new FileDB();
      await FileDB.instance.load();
    }
    return FileDB.instance;
  }

  private async load() {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      const items = JSON.parse(data);
      this.items = new Map(Object.entries(items));
    } catch (error) {
      await this.save();
    }
  }

  private async save() {
    const data = Object.fromEntries(this.items);
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  }

  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async createItem(item: Item): Promise<Item> {
    this.items.set(item.id, item);
    await this.save();
    return item;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, ...updates, updatedAt: new Date() };
    this.items.set(id, updatedItem);
    await this.save();
    return updatedItem;
  }

  async addEvent(itemId: string, event: Event): Promise<Item | undefined> {
    const item = this.items.get(itemId);
    if (!item) return undefined;

    item.events.push(event);
    item.updatedAt = new Date();
    await this.save();
    return item;
  }

  async getAllItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }
}