const API_BASE_URL = "http://localhost:3000/api";

async function apiRequest(endpoint: string, method = "GET", body?: any) {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const fetchItems = async () => apiRequest("/items");

export const fetchItemById = async (id: string) => apiRequest(`/items/${id}`);

export const createItem = async (itemData: any) =>
  apiRequest("/items", "POST", itemData);

export const updateItem = async (id: string, itemData: any) =>
  apiRequest(`/items/${id}`, "PUT", itemData);

export const addEvent = async (id: string, eventData: any) =>
  apiRequest(`/items/${id}/events`, "POST", eventData);

export const fetchItemEvents = async (id: string) =>
  apiRequest(`/items/${id}/events`);

export const fetchLastEvent = async (id: string) =>
  apiRequest(`/items/${id}/events/last`);
