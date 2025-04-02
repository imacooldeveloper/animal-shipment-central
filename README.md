
# Vivarium SOP - Shipping Operations Platform

## Project Overview

Vivarium SOP is a comprehensive shipping operations platform designed specifically for laboratory and research facilities to efficiently manage and track animal shipments. The platform provides a seamless way to manage both import and export shipments, track progress, maintain detailed records, and streamline the entire animal transfer process from initial request to delivery.

## Key Features

### Dashboard and Navigation
- **Centralized Dashboard**: View key metrics, recent activity, and shipment counts at a glance
- **Intuitive Navigation**: Easy access to imports, exports, shipments, and documentation
- **Quick Filters**: Filter shipments by status (draft, in progress, completed)
- **Pagination**: Navigate through large datasets with ease

### Import Management
- **Detailed Import Tracking**: Monitor incoming animal shipments with comprehensive information
- **Status Monitoring**: Track the progress of each import from initial request to receipt
- **Lab Information**: Record and access sending lab details and protocols
- **Animal Details**: Document species, strains, quantities, and special requirements
- **Checklist System**: Ensure all required steps are completed before animal arrival

### Export Management
- **Complete Export Workflow**: Manage outgoing animal shipments from request to delivery
- **Destination Tracking**: Record recipient labs and their contact information
- **Courier Integration**: Track shipping providers, account numbers, and pickup dates
- **International Shipping Support**: Handle domestic and international transfers with appropriate documentation
- **Checklist Verification**: Confirm all export requirements are met prior to shipment

### Documentation and Communication
- **Notes System**: Add and track notes for each shipment for better team communication
- **Document Management**: Organize health certificates, transfer forms, and permits
- **Activity Timeline**: View the complete history of actions taken for each shipment
- **Export Permits**: Track and manage documentation required for animal transfer

### Reporting and Analytics
- **Shipment Metrics**: View counts of imports/exports by status and type
- **Activity Reports**: Track recent shipments and actions taken
- **Lab Partnerships**: Identify frequent sending/receiving labs

## Technical Implementation

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and improved developer experience
- **UI Components**: Built with shadcn/ui (based on Radix UI) for accessible, customizable interface elements
- **Styling**: Tailwind CSS for responsive, utility-first styling approach
- **State Management**:
  - React Query for server state and data fetching
  - React Context API and hooks for local state management
- **Layout**: Responsive design that works across desktop and mobile devices

### Backend Integration
- **Database**: Supabase (PostgreSQL) for reliable data storage and retrieval
- **Authentication**: Future implementation for user management and access control
- **Real-time Updates**: Support for instant updates to shipment status and notes
- **API Structure**: RESTful API design for imports, exports, and support data

### Data Models
- **Imports**: Track incoming shipments with detailed metadata
- **Exports**: Manage outgoing shipments with comprehensive information
- **Checklists**: Custom checklists for both import and export processes
- **Notes**: Timestamped communication records for each shipment
- **Message Templates**: Pre-defined templates for common communications

## Deployment and Infrastructure
- **Hosting**: Deployed on Lovable platform for reliable access
- **Database**: Supabase PostgreSQL for structured data storage
- **Future Expansion**: Prepared for future integration with email notifications and file storage

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn package manager

### Installation
1. Clone the repository:
```sh
git clone https://github.com/yourusername/vivarium-sop.git
```

2. Navigate to the project directory:
```sh
cd vivarium-sop
```

3. Install dependencies:
```sh
npm install
# or
yarn install
```

4. Set up environment variables:
Create a `.env` file in the root directory with the following:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```sh
npm run dev
# or
yarn dev
```

## Populating the Application with Sample Data

### Using the Supabase Dashboard
1. Navigate to the Supabase project dashboard
2. Go to the SQL Editor
3. Create tables for imports and exports with the following schema:

#### Imports Table
```sql
CREATE TABLE IF NOT EXISTS imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  import_number TEXT NOT NULL,
  sending_lab TEXT NOT NULL,
  arrival_date DATE,
  protocol_number TEXT,
  courier TEXT,
  courier_account_number TEXT,
  animal_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  status TEXT,
  notes TEXT,
  lab_contact_name TEXT,
  lab_contact_email TEXT,
  checklist TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);
```

#### Exports Table
```sql
CREATE TABLE IF NOT EXISTS exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  export_number TEXT NOT NULL,
  sending_lab TEXT NOT NULL,
  destination_lab TEXT NOT NULL,
  departure_date DATE,
  protocol_number TEXT,
  courier TEXT,
  courier_account_number TEXT,
  animal_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  tracking_number TEXT,
  status TEXT,
  notes TEXT,
  lab_contact_name TEXT,
  lab_contact_email TEXT,
  checklist TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  is_international BOOLEAN DEFAULT FALSE
);
```

4. Insert sample data:

```sql
-- Sample imports
INSERT INTO imports (import_number, sending_lab, arrival_date, animal_type, quantity, status)
VALUES 
  ('IMP-2023-001', 'Jackson Laboratory, USA', '2023-06-15', 'Mouse - C57BL/6', '10 males, 10 females', 'complete'),
  ('IMP-2023-002', 'Taconic Biosciences, Germany', '2023-07-22', 'Rat - Sprague Dawley', '5 males', 'progress'),
  ('IMP-2023-003', 'Charles River, France', '2023-08-10', 'Mouse - BALB/c', '15 females', 'draft');

-- Sample exports
INSERT INTO exports (export_number, sending_lab, destination_lab, departure_date, animal_type, quantity, status)
VALUES 
  ('EXP-2023-001', 'Our Facility', 'University of Cambridge, UK', '2023-05-20', 'Mouse - Transgenic A', '8 males', 'complete'),
  ('EXP-2023-002', 'Our Facility', 'Max Planck Institute, Germany', '2023-07-05', 'Mouse - Knockout B', '12 females', 'progress'),
  ('EXP-2023-003', 'Our Facility', 'University of Tokyo, Japan', '2023-09-15', 'Rat - Lewis', '4 males, 4 females', 'draft');
```

### Using the Application
Alternatively, you can create shipments directly through the application:

1. Navigate to the "New Shipment" page
2. Select either "Import" or "Export"
3. Fill in the required information
4. Save the shipment

## Usage Guide

### Creating a New Shipment
1. Click on "New Shipment" from the dashboard or navigation menu
2. Select whether you're creating an import or export
3. Fill out the required information in the form
4. Save as draft or submit the completed form

### Managing Existing Shipments
1. View all shipments from the "Shipments" page
2. Filter by type (import/export) or status (draft/in progress/complete)
3. Click on a shipment to view its details
4. Update status, add notes, or edit details as needed

### Adding Notes to Shipments
1. Navigate to a shipment's detail page
2. Scroll to the "Notes & Updates" section
3. Enter your note in the text field
4. Click "Add Note" to save

### Tracking Shipment Progress
1. Use the checklist feature to mark completed steps
2. View overall progress on the shipment detail page
3. Filter the dashboard to focus on in-progress shipments

## Roadmap

### Upcoming Features
- **User Authentication**: Role-based access control with login system
- **Email Notifications**: Automated alerts for shipment status changes
- **Document Attachments**: File upload capability for shipment documentation
- **Advanced Reporting**: Customizable reports and data export functionality
- **Calendar Integration**: View scheduled shipments in calendar format

### Planned Improvements
- **Workflow Automation**: Automated progression of shipment stages
- **Integration with Regulatory Systems**: Connect with IACUC and other compliance systems
- **Barcode/QR Code Support**: Scanning capability for efficient tracking
- **Mobile Application**: Native mobile app for on-the-go access

## Troubleshooting

### Common Issues

#### Data Not Loading
- Check that your Supabase configuration is correct
- Verify that the database tables exist and have the correct structure
- Check browser console for any errors

#### Form Submission Issues
- Ensure all required fields are completed
- Verify that your connection to Supabase is working

#### Display Problems
- Try clearing your browser cache
- Ensure you're using a supported browser (Chrome, Firefox, Safari, Edge)

## Contributing

We welcome contributions to improve Vivarium SOP. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved. Unauthorized copying, distribution, modification, public display, or public performance of this software is strictly prohibited.

## Acknowledgments

- Developed for research facilities and vivarium operations
- Inspired by the needs of laboratory animal management professionals
- Special thanks to all beta testers and early adopters
