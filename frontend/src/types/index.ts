export interface Event {
    id: string;
    itemId: string;
    type: 'LOCATION_UPDATE' | 'CUSTODIAN_CHANGE' | 'STATUS_UPDATE';
    location?: string;
    custodian?: string;
    status?: string;
    timestamp: Date;
    notes?: string;
}

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

export interface CreateItemPayload {
    name: string;
    description?: string;
    color?: string;
    price?: number;
}

export interface CreateEventPayload {
    type: Event['type'];
    location?: string;
    custodian?: string;
    status?: string;
    notes?: string;
}