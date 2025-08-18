# Menu Selection and Session Planning Microservices

This document describes the new microservices created to improve menu selection and session planning functionality in the BKR Menu Magic application.

## Overview

The application now includes three main microservice components:

1. **MenuSelectionMicroservice** - Enhanced menu selection with dropdown checklists
2. **SessionPlanningMicroservice** - Advanced session planning and management
3. **IntegratedMenuAndSession** - Integration component that combines both services

## Features

### MenuSelectionMicroservice

#### Core Features
- **Dropdown Checklists**: Easy selection of menu items with checkboxes
- **Multiple View Modes**: Accordion, Grid, and List views
- **Advanced Filtering**: Category, meal type, price range, vegetarian options
- **Search Functionality**: Real-time search across menu items
- **Quick Add Templates**: Pre-configured menu combinations
- **Cart Management**: Add/remove items with quantity control
- **Favorites System**: Bookmark frequently used items
- **Export Functionality**: CSV export of selected items

#### Filtering Options
- Category-based filtering
- Meal type filtering (Breakfast, Lunch, Dinner, etc.)
- Price range selection
- Vegetarian-only options
- Spice level indicators
- Dietary restrictions

#### View Modes
- **Accordion**: Organized by category with expandable sections
- **Grid**: Card-based layout for visual browsing
- **List**: Compact list view for quick scanning

### SessionPlanningMicroservice

#### Core Features
- **Session Management**: Create, edit, and manage event sessions
- **Progress Tracking**: Visual progress indicators and status management
- **Time Management**: Flexible time window configuration
- **Headcount Control**: Dynamic guest count management
- **Cost Estimation**: Automatic cost calculations
- **Staff Planning**: Service staff allocation
- **Status Workflow**: Planned → In Progress → Completed

#### Advanced Features
- **Dietary Restrictions**: Track special dietary requirements
- **Special Instructions**: Add custom notes and requirements
- **Export Reports**: Generate detailed session reports
- **Real-time Updates**: Live session status updates
- **Responsive Design**: Mobile-friendly interface

### IntegratedMenuAndSession

#### Integration Features
- **Unified Interface**: Single component combining both services
- **Step-by-Step Workflow**: Guided planning process
- **Progress Tracking**: Visual progress indicators
- **Data Synchronization**: Seamless data flow between services
- **Summary Dashboard**: Comprehensive planning overview

## Usage

### Basic Implementation

```tsx
import IntegratedMenuAndSession from './components/IntegratedMenuAndSession';

function App() {
  const handlePlanningComplete = (data) => {
    console.log('Planning completed:', data);
    // Handle the completed planning data
  };

  return (
    <IntegratedMenuAndSession
      language="en"
      eventData={{ eventName: "Wedding Reception" }}
      onComplete={handlePlanningComplete}
    />
  );
}
```

### Individual Microservice Usage

#### Menu Selection Only

```tsx
import MenuSelectionMicroservice from './components/MenuSelectionMicroservice';

function MenuOnly() {
  const handleMenuSelection = (items) => {
    console.log('Selected items:', items);
  };

  return (
    <MenuSelectionMicroservice
      language="en"
      onMenuSelection={handleMenuSelection}
      showPricing={true}
      allowMultiple={true}
    />
  );
}
```

#### Session Planning Only

```tsx
import SessionPlanningMicroservice from './components/SessionPlanningMicroservice';

function SessionsOnly() {
  const handleSessionUpdate = (sessions) => {
    console.log('Updated sessions:', sessions);
  };

  return (
    <SessionPlanningMicroservice
      language="en"
      onSessionUpdate={handleSessionUpdate}
      showAdvancedFeatures={true}
    />
  );
}
```

## Props and Configuration

### MenuSelectionMicroservice Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `'en' \| 'ta'` | Required | Language selection |
| `onMenuSelection` | `function` | Optional | Callback for menu changes |
| `initialSelection` | `array` | `[]` | Pre-selected menu items |
| `showPricing` | `boolean` | `true` | Show/hide pricing information |
| `allowMultiple` | `boolean` | `true` | Allow multiple item selection |
| `maxItems` | `number` | `50` | Maximum items that can be selected |

### SessionPlanningMicroservice Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `'en' \| 'ta'` | Required | Language selection |
| `eventData` | `object` | Optional | Event information |
| `onSessionUpdate` | `function` | Optional | Callback for session changes |
| `initialSessions` | `array` | `[]` | Pre-configured sessions |
| `showAdvancedFeatures` | `boolean` | `true` | Show/hide advanced options |

### IntegratedMenuAndSession Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `'en' \| 'ta'` | Required | Language selection |
| `eventData` | `object` | Optional | Event information |
| `onComplete` | `function` | Optional | Callback when planning is complete |

## Data Structure

### Menu Item Structure

```typescript
interface MenuItem {
  id: string;
  name_en: string;
  name_ta: string;
  isVegetarian: boolean;
  estimatedCost?: number;
  image?: string;
  category: string;
}
```

### Session Structure

```typescript
interface Session {
  id: string;
  name: string;
  name_ta: string;
  timeWindow: {
    startTime: string;
    endTime: string;
  };
  headCount: number;
  selectedItems: any[];
  dietaryRestrictions: string[];
  serviceStaff: number;
  specialInstructions: string;
  estimatedCost: number;
  status: 'planned' | 'in-progress' | 'completed';
  notes: string;
}
```

## Styling and Themes

All components support:
- **Dark/Light Theme**: Automatic theme switching
- **Responsive Design**: Mobile-first approach
- **Custom CSS Classes**: Tailwind CSS integration
- **Animation**: Framer Motion animations
- **Accessibility**: ARIA labels and keyboard navigation

## Performance Features

- **Memoized Components**: React.memo and useMemo for optimization
- **Lazy Loading**: Components load only when needed
- **Efficient Filtering**: Optimized search and filter algorithms
- **State Management**: Local state with optional callbacks

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features
- CSS Grid and Flexbox
- Local Storage for persistence

## Dependencies

- React 18+
- TypeScript 4.5+
- Tailwind CSS 3.0+
- Framer Motion 6.0+
- Lucide React (for icons)
- Radix UI components

## Future Enhancements

- **Real-time Collaboration**: Multi-user planning
- **Template System**: Pre-built event templates
- **Integration APIs**: Connect with external services
- **Advanced Analytics**: Planning insights and recommendations
- **Mobile App**: Native mobile application
- **Offline Support**: PWA capabilities

## Troubleshooting

### Common Issues

1. **Component Not Rendering**: Check if all required props are provided
2. **Performance Issues**: Ensure proper memoization and avoid unnecessary re-renders
3. **Styling Problems**: Verify Tailwind CSS is properly configured
4. **Language Issues**: Ensure language prop is correctly set

### Debug Mode

Enable debug logging by setting:

```typescript
const DEBUG = process.env.NODE_ENV === 'development';
```

## Contributing

When contributing to these microservices:

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include language support for both English and Tamil
4. Test responsive design on multiple screen sizes
5. Ensure accessibility compliance
6. Add proper error handling
7. Include unit tests for new functionality

## License

This project is licensed under the MIT License.
