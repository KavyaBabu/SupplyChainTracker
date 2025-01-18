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