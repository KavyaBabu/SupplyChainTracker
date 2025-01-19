import request from 'supertest';
import app from '../src/app';
import fs from 'fs/promises';
import path from 'path';

const TEST_DB_PATH = path.join(__dirname, '../data/items.json');

describe('Item API Endpoints', () => {
  let testItemId: string;

  beforeEach(async () => {
    await fs.writeFile(TEST_DB_PATH, JSON.stringify({}));
  });

  it('should create a new item', async () => {
    const response = await request(app)
      .post('/api/items')
      .send({
        name: 'Test Item',
        description: 'A test item description',
        color: 'blue',
        price: 100
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Item');

    testItemId = response.body.id; 
  });

  it('should retrieve all items', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should retrieve a single item by ID', async () => {
    const response = await request(app).get(`/api/items/${testItemId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testItemId);
  });

  it('should return 404 for a non-existing item', async () => {
    const response = await request(app).get('/api/items/non-existing-id');
    expect(response.status).toBe(404);
  });

  it('should update an existing item', async () => {
    const response = await request(app)
      .put(`/api/items/${testItemId}`)
      .send({ color: 'red' });

    expect(response.status).toBe(200);
    expect(response.body.color).toBe('red');
  });

  it('should return 404 when updating a non-existing item', async () => {
    const response = await request(app)
      .put('/api/items/non-existing-id')
      .send({ color: 'red' });

    expect(response.status).toBe(404);
  });

  it('should add an event to an item', async () => {
    const eventResponse = await request(app)
      .post(`/api/items/${testItemId}/events`)
      .send({
        type: 'LOCATION_UPDATE',
        location: 'Warehouse A',
        custodian: 'John Doe'
      });

    expect(eventResponse.status).toBe(200);
    expect(eventResponse.body.events.length).toBe(1);
    expect(eventResponse.body.events[0].location).toBe('Warehouse A');
  });

  it('should retrieve all events of an item', async () => {
    const response = await request(app).get(`/api/items/${testItemId}/events`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should retrieve the last event of an item', async () => {
    const response = await request(app).get(`/api/items/${testItemId}/events/last`);
    expect(response.status).toBe(200);
    expect(response.body.location).toBe('Warehouse A');
  });

  it('should return 404 for getting events of a non-existing item', async () => {
    const response = await request(app).get('/api/items/non-existing-id/events');
    expect(response.status).toBe(404);
  });

  it('should return 404 for getting last event of a non-existing item', async () => {
    const response = await request(app).get('/api/items/non-existing-id/events/last');
    expect(response.status).toBe(404);
  });
});
