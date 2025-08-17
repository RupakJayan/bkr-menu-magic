# Admin Dashboard Microservices

This directory contains the microservices architecture for the Admin Dashboard. Each component is designed to be a focused, single-responsibility service that can be developed, tested, and maintained independently.

## Architecture Overview

The Admin Dashboard follows a microservices pattern where each major functionality is broken down into smaller, focused components:

```
AdminDashboard (Main Container)
├── DashboardHeader (Header Service)
├── StatsOverview (Statistics Service)
├── RecentEvents (Events Display Service)
├── QuickActions (Action Buttons Service)
├── EventCalendar (Calendar Service)
├── EventManagement (Event Management Service)
├── AnalyticsOverview (Analytics Service)
├── EventForm (Event Form Service)
└── DataExport (Data Export Service)
```

## Microservices Breakdown

### 1. DashboardHeader
- **Purpose**: Displays the main dashboard title and description
- **Responsibility**: Header presentation and branding
- **Props**: `language`, `isDark`
- **Dependencies**: `framer-motion`

### 2. StatsOverview
- **Purpose**: Displays key performance indicators and statistics
- **Responsibility**: Statistics presentation with animations
- **Props**: `language`, `isDark`
- **Dependencies**: `framer-motion`, `lucide-react`, UI components

### 3. RecentEvents
- **Purpose**: Shows recent events with status and details
- **Responsibility**: Event list display and status management
- **Props**: `language`, `isDark`
- **Dependencies**: UI components, status utilities

### 4. QuickActions
- **Purpose**: Provides quick access to common admin actions
- **Responsibility**: Action button management and event handling
- **Props**: `language`, `isDark`
- **Dependencies**: UI components, action handlers

### 5. EventCalendar
- **Purpose**: Calendar view for events (placeholder for future implementation)
- **Responsibility**: Calendar interface placeholder
- **Props**: `language`, `isDark`
- **Dependencies**: UI components

### 6. EventManagement
- **Purpose**: Manages all events with search and filter capabilities
- **Responsibility**: Event listing, search, and filtering
- **Props**: `language`, `isDark`
- **Dependencies**: UI components, search/filter handlers

### 7. AnalyticsOverview
- **Purpose**: Displays analytics and performance metrics
- **Responsibility**: Analytics presentation
- **Props**: `language`, `isDark`
- **Dependencies**: UI components

### 8. EventForm
- **Purpose**: Form for creating and editing events
- **Responsibility**: Event data input and validation
- **Props**: `language`, `isDark`, `onSave`, `onCancel`, `initialData`
- **Dependencies**: UI components, form state management

### 9. DataExport
- **Purpose**: Handles data export functionality
- **Responsibility**: Export type selection, format options, and export process
- **Props**: `language`, `isDark`
- **Dependencies**: UI components, export handlers

## Benefits of This Architecture

1. **Maintainability**: Each service has a single responsibility
2. **Testability**: Components can be tested in isolation
3. **Reusability**: Services can be reused in other parts of the application
4. **Scalability**: Easy to add new features or modify existing ones
5. **Team Development**: Different developers can work on different services
6. **Performance**: Components can be optimized individually

## Adding New Microservices

To add a new microservice:

1. Create a new component file in this directory
2. Follow the naming convention: `ComponentName.tsx`
3. Implement the component with proper TypeScript interfaces
4. Export the component as default
5. Import and use it in the main AdminDashboard component

## Best Practices

- Keep each service focused on a single responsibility
- Use consistent prop interfaces (`language`, `isDark`)
- Implement proper error handling and loading states
- Use TypeScript for type safety
- Follow the existing UI component patterns
- Add proper documentation and comments

## Future Enhancements

- Add state management (Redux/Zustand) for complex state
- Implement real-time updates for live data
- Add unit tests for each microservice
- Implement lazy loading for better performance
- Add service worker for offline functionality
