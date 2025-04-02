
# Vivarium SOP - Shipping Operations Platform

## Project Overview

Vivarium SOP is a comprehensive shipping operations platform designed specifically for laboratory and research facilities to efficiently manage and track animal shipments. The platform provides a seamless way to manage both import and export shipments, track progress, maintain detailed records, and streamline the entire animal transfer process from initial request to delivery.

## Key Features

### Dashboard and Navigation
- **Centralized Dashboard**: View key metrics, recent activity, and shipment counts at a glance
- **Intuitive Navigation**: Easy access to imports, exports, shipments, and documentation
- **Quick Filters**: Filter shipments by status (draft, in progress, completed)

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
- Node.js (v14+)
- npm or yarn package manager

### Installation
1. Clone the repository:
```sh
git clone <repository-url>
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

4. Start the development server:
```sh
npm run dev
# or
yarn dev
```

### Environment Setup
To connect to the Supabase backend, you'll need to configure environment variables:

1. Create a `.env` file in the root directory
2. Add the following variables with your Supabase project credentials:
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Populating the Application with Sample Data

To help with testing and development, you can populate the application with sample shipment data:

1. Navigate to the Supabase dashboard for your project
2. Go to the SQL Editor
3. Run the provided sample data SQL script (available in the `/scripts` directory)
4. Refresh the application to see the sample shipments

Alternatively, you can manually create new shipments through the UI:

1. Click "New Import" or "New Export" from the respective pages
2. Fill in the required information in the form
3. Submit the form to create a new shipment record

## Usage Guide

### Creating a New Shipment
1. Navigate to either the Imports or Exports page
2. Click the "New Import" or "New Export" button
3. Fill out the required information in the form
4. Submit the form to create the new shipment record

### Tracking Shipment Progress
1. Access a specific shipment detail page
2. Update the checklist items as steps are completed
3. Add notes to provide context or updates about the shipment
4. Monitor the progress bar to see completion percentage

### Adding Notes to Shipments
1. Navigate to a shipment detail page
2. Scroll to the Notes section
3. Enter your note in the text area
4. Click "Add Note" to save the note to the shipment record

## Roadmap

### Upcoming Features
- **User Authentication**: Role-based access control with login system
- **Email Notifications**: Automated alerts for shipment status changes
- **Document Attachments**: File upload capability for shipment documentation
- **Advanced Reporting**: Customizable reports and data export functionality
- **Calendar Integration**: View scheduled shipments in calendar format
- **Mobile App**: Native mobile application for on-the-go access

### Planned Improvements
- **Workflow Automation**: Automated progression of shipment stages
- **Integration with Regulatory Systems**: Connect with IACUC and other compliance systems
- **Barcode/QR Code Support**: Scanning capability for efficient tracking
- **API Access**: External API for integration with other laboratory systems

## Contributing

We welcome contributions to improve Vivarium SOP. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## Support

For support, please contact [support@vivariumsop.com](mailto:support@vivariumsop.com) or raise an issue in the GitHub repository.

## License

This project is proprietary software. All rights reserved. Unauthorized copying, distribution, modification, public display, or public performance of this software is strictly prohibited.

## Acknowledgments

- Developed for research facilities and vivarium operations
- Inspired by the needs of laboratory animal management professionals
- Special thanks to all beta testers and early adopters
