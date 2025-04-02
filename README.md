
# Vivarium SOP - Shipping Operations Platform

## Project Overview

Vivarium SOP is a comprehensive shipping operations platform designed to efficiently manage and track animal shipments for laboratories and research facilities. The platform provides a seamless way to manage both import and export shipments, track progress, and maintain detailed records of animal transfers.

## Features

- **Dashboard**: View key metrics and recent shipments at a glance
- **Import Management**: Track incoming animal shipments with detailed information
- **Export Management**: Manage outgoing animal shipments with comprehensive tracking
- **Shipment Details**: Access detailed views of each shipment with progress tracking
- **Notes System**: Add and track notes for each shipment for better communication
- **Checklist Management**: Track completion status of required steps for each shipment

## Technical Stack

This project is built with:

- **Frontend Framework**: React with TypeScript
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state, React hooks for local state
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Planned for future implementation
- **Deployment**: Hosted on Lovable platform

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
```

2. Navigate to the project directory:
```sh
cd <YOUR_PROJECT_NAME>
```

3. Install dependencies:
```sh
npm i
```

4. Start the development server:
```sh
npm run dev
```

## Project Structure

- `/src/components`: UI components
  - `/ui`: shadcn/ui base components
  - `/imports`: Components related to import shipments
  - `/exports`: Components related to export shipments
  - `/shipments`: Shared components for all shipment types
- `/src/hooks`: Custom React hooks
  - `/import`: Hooks for import-related functionality
  - `/export`: Hooks for export-related functionality
  - `/shipment`: Shared hooks for all shipment types
- `/src/pages`: Page components
- `/src/integrations`: Integration with external services

## Database Schema

The application uses a Supabase PostgreSQL database with the following main tables:

- **imports**: Store information about incoming animal shipments
- **exports**: Store information about outgoing animal shipments
- **message_templates**: Store templates for automated messages

Each shipment record includes fields for tracking essential details such as:
- Shipping numbers
- Lab information
- Animal details
- Courier information
- Dates and statuses
- Notes and checklists

## Future Enhancements

- User authentication and role-based access control
- Email notifications for shipment updates
- Document attachments for shipments
- Advanced reporting and analytics
- Mobile application support

## Deployment

The application can be deployed using the Lovable platform by clicking on Share -> Publish.

## Custom Domain Setup

To connect a custom domain, navigate to Project > Settings > Domains in Lovable and click Connect Domain.

## License

This project is proprietary software. All rights reserved.
