import { Event } from './Event';

export interface Item {
  id: string;
  name: string;
  description?: string;
  color?: string;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
  events: Event[];
}
