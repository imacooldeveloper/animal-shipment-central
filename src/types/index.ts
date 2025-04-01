
export type ShipmentStatus = 'draft' | 'progress' | 'complete';

export interface Shipment {
  id: string;
  country: string;
  type: 'import' | 'export';
  status: ShipmentStatus;
  lastUpdated: string;
  animalType: string;
  lab?: string; // Added for imports/exports (sending or destination lab)
  courier?: string; // Added for tracking shipping provider
  arrivalDate?: string; // For imports
  departureDate?: string; // For exports
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
  labContactName?: string; // Added for lab contact
  labContactEmail?: string; // Added for lab contact
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

export interface ImportShipment {
  importNumber: string;
  sendingLab: string;
  protocolNumber?: string;
  courier?: string;
  courierOther?: string;
  courierAccountNumber?: string;
  arrivalDate?: Date;
  animalType: string;
  quantity: string;
  status?: string;
  statusOther?: string;
  notes?: string;
  documents?: File[];
  type: 'import';
  labContactName?: string;
  labContactEmail?: string;
}

export interface ExportShipment {
  exportNumber: string;
  sendingLab: string;
  destinationLab: string;
  protocolNumber?: string;
  courier?: string;
  courierOther?: string;
  courierAccountNumber?: string;
  departureDate?: Date;
  animalType: string;
  quantity: string;
  status?: string;
  statusOther?: string;
  trackingNumber?: string;
  notes?: string;
  documents?: File[];
  type: 'export';
  labContactName?: string;
  labContactEmail?: string;
}
