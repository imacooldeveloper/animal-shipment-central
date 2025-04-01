
export type ShipmentStatus = 'draft' | 'progress' | 'complete';

export interface Shipment {
  id: string;
  country: string;
  type: 'import' | 'export';
  status: ShipmentStatus;
  lastUpdated: string;
  animalType: string;
  checklist: {
    transferForms: boolean;
    healthCert: boolean;
    exportPermit: boolean;
    courier: boolean;
    pickupDate: boolean;
    packageReady: boolean;
  };
  documents: Document[];
  timeline: TimelineEvent[];
}

export interface Document {
  id: string;
  title: string;
  dateAdded: string;
  expirationDate?: string;
  fileUrl: string;
  fileType: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface TransferForm {
  id: string;
  country: string;
  title: string;
  animalType: string;
  documentType: string;
  fileUrl: string;
  dateAdded: string;
  fileType: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  variables: string[];
}
