
import { Shipment, TransferForm, MessageTemplate } from '../types';

export const mockShipments: Shipment[] = [
  {
    id: 'SHP-2023-001',
    country: 'Germany',
    type: 'export',
    status: 'complete',
    lastUpdated: '2023-09-15',
    animalType: 'Rodents',
    checklist: {
      transferForms: true,
      healthCert: true,
      exportPermit: true,
      courier: true,
      pickupDate: true,
      packageReady: true
    },
    documents: [
      {
        id: 'DOC-001',
        title: 'Health Certificate',
        dateAdded: '2023-08-10',
        expirationDate: '2023-12-10',
        fileUrl: '#',
        fileType: 'pdf'
      },
      {
        id: 'DOC-002',
        title: 'Export Permit',
        dateAdded: '2023-08-15',
        fileUrl: '#',
        fileType: 'pdf'
      }
    ],
    timeline: [
      {
        id: 'TML-001',
        title: 'Shipment Created',
        description: 'Shipment request received and logged',
        timestamp: '2023-08-01'
      },
      {
        id: 'TML-002',
        title: 'Health Certificate Uploaded',
        description: 'Approved health certificate added to shipment',
        timestamp: '2023-08-10'
      },
      {
        id: 'TML-003',
        title: 'Shipment Completed',
        description: 'Animals successfully shipped to destination',
        timestamp: '2023-09-15'
      }
    ]
  },
  {
    id: 'SHP-2023-002',
    country: 'France',
    type: 'import',
    status: 'progress',
    lastUpdated: '2023-10-05',
    animalType: 'Zebrafish',
    checklist: {
      transferForms: true,
      healthCert: true,
      exportPermit: false,
      courier: true,
      pickupDate: false,
      packageReady: false
    },
    documents: [
      {
        id: 'DOC-003',
        title: 'Health Certificate',
        dateAdded: '2023-09-20',
        expirationDate: '2024-01-20',
        fileUrl: '#',
        fileType: 'pdf'
      }
    ],
    timeline: [
      {
        id: 'TML-004',
        title: 'Shipment Created',
        description: 'Import request received from Paris lab',
        timestamp: '2023-09-15'
      },
      {
        id: 'TML-005',
        title: 'Courier Assigned',
        description: 'FastLab Logistics assigned for shipment',
        timestamp: '2023-09-28'
      }
    ]
  },
  {
    id: 'SHP-2023-003',
    country: 'United Kingdom',
    type: 'export',
    status: 'draft',
    lastUpdated: '2023-10-10',
    animalType: 'Rodents',
    checklist: {
      transferForms: false,
      healthCert: false,
      exportPermit: false,
      courier: false,
      pickupDate: false,
      packageReady: false
    },
    documents: [],
    timeline: [
      {
        id: 'TML-006',
        title: 'Shipment Created',
        description: 'Export request initiated for London research center',
        timestamp: '2023-10-10'
      }
    ]
  }
];

export const mockTransferForms: TransferForm[] = [
  {
    id: 'TF-001',
    country: 'Germany',
    title: 'Health Declaration Form',
    animalType: 'Rodents',
    documentType: 'Health Certificate',
    fileUrl: '#',
    dateAdded: '2023-01-15',
    fileType: 'pdf'
  },
  {
    id: 'TF-002',
    country: 'France',
    title: 'Customs Declaration Form',
    animalType: 'Zebrafish',
    documentType: 'Customs Declaration',
    fileUrl: '#',
    dateAdded: '2023-02-20',
    fileType: 'docx'
  },
  {
    id: 'TF-003',
    country: 'United Kingdom',
    title: 'Animal Health Certificate',
    animalType: 'Rodents',
    documentType: 'Health Certificate',
    fileUrl: '#',
    dateAdded: '2023-03-10',
    fileType: 'pdf'
  },
  {
    id: 'TF-004',
    country: 'Japan',
    title: 'Import Permit Application',
    animalType: 'Rodents',
    documentType: 'Import Permit',
    fileUrl: '#',
    dateAdded: '2023-04-05',
    fileType: 'pdf'
  },
  {
    id: 'TF-005',
    country: 'United States',
    title: 'CDC Import Declaration',
    animalType: 'Zebrafish',
    documentType: 'Import Permit',
    fileUrl: '#',
    dateAdded: '2023-05-12',
    fileType: 'pdf'
  }
];

export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: 'MT-001',
    title: 'Shipment Confirmation',
    content: 'Dear Partner,\n\nWe are pleased to confirm that the shipment to [COUNTRY] is scheduled for [DATE]. The shipment contains [ANIMAL_TYPE] and is being handled by [COURIER].\n\nPlease find attached all the required documentation for this shipment. Let us know if you need any additional information.\n\nBest regards,\nThe Import/Export Team',
    variables: ['COUNTRY', 'DATE', 'ANIMAL_TYPE', 'COURIER']
  },
  {
    id: 'MT-002',
    title: 'Document Request',
    content: 'Dear Colleague,\n\nWe are preparing a shipment of [ANIMAL_TYPE] to [COUNTRY] and require the following documents:\n\n- Health Certificate\n- Import Permit\n- Customs Declaration\n\nPlease provide these at your earliest convenience, but no later than [DEADLINE].\n\nThank you,\nThe Import/Export Team',
    variables: ['ANIMAL_TYPE', 'COUNTRY', 'DEADLINE']
  },
  {
    id: 'MT-003',
    title: 'Permit Notification',
    content: 'Hello,\n\nWe would like to inform you that the permit [PERMIT_NAME] has been uploaded and is valid until [EXPIRY_DATE]. This permit is for the shipment of [ANIMAL_TYPE] to [COUNTRY].\n\nPlease review and confirm receipt.\n\nBest regards,\nThe Import/Export Team',
    variables: ['PERMIT_NAME', 'EXPIRY_DATE', 'ANIMAL_TYPE', 'COUNTRY']
  }
];

export const countries = [
  'Australia', 
  'Brazil', 
  'Canada', 
  'China', 
  'France', 
  'Germany', 
  'India', 
  'Italy', 
  'Japan', 
  'South Korea', 
  'United Kingdom', 
  'United States'
];

export const animalTypes = ['Rodents', 'Zebrafish', 'Primates', 'Rabbits', 'Birds'];

export const documentTypes = [
  'Health Certificate', 
  'Import Permit', 
  'Export Permit', 
  'Customs Declaration', 
  'Transit Permit',
  'Veterinary Certificate'
];
