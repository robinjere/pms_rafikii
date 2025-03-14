export interface Property {
    id: string;
    name: string;
    address: string;
    type: 'residential' | 'commercial';
    utilities: Utility[];
}

export interface Utility {
    id: string;
    propertyId: string;
    type: 'electricity' | 'water' | 'gas';
    amount: number;
    date: string;
}