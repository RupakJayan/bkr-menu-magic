# BKR Menu Magic - Event Planning Platform

A comprehensive event planning platform built with React, TypeScript, and modern web technologies. This platform provides a complete solution for event planning, menu selection, session management, and venue selection.

## 🚀 Features

- **Multi-language Support**: English and Tamil (தமிழ்)
- **Microservices Architecture**: Modular, scalable components
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Theme Support**: Light, dark, and system theme modes
- **Real-time Updates**: Live data synchronization
- **Export/Import**: JSON-based data portability

## 🏗️ Architecture

The platform is built using a microservices architecture where each major functionality is implemented as an independent, reusable component:

### Core Microservices

1. **MenuSelectionMicroservice** - Advanced menu planning with filtering and customization
2. **SessionPlanningMicroservice** - Comprehensive session planning with timeline management
3. **IntegratedMenuAndSession** - Unified interface for complete event planning

### Enhanced Components

1. **EnhancedEventPlanner** - Advanced event planning with analytics
2. **EnhancedMenuSelection** - Intelligent menu planning with dietary preferences
3. **VenueSelection** - Venue management and selection
4. **EventPlanningFlow** - Complete event planning workflow

## 🛣️ Available Routes

### Main Pages
- `/` - Landing page with all components showcase
- `/admin` - Admin dashboard (English)
- `/admin/ta` - Admin dashboard (Tamil)

### Event Planning
- `/event-planning` - Complete event planning flow (English)
- `/event-planning/ta` - Complete event planning flow (Tamil)

### Microservices
- `/menu-selection` - Standalone menu selection (English)
- `/menu-selection/ta` - Standalone menu selection (Tamil)
- `/session-planning` - Standalone session planning (English)
- `/session-planning/ta` - Standalone session planning (Tamil)
- `/integrated-planning` - Integrated menu and session planning (English)
- `/integrated-planning/ta` - Integrated menu and session planning (Tamil)

### Enhanced Components
- `/enhanced-event-planner` - Enhanced event planner (English)
- `/enhanced-event-planner/ta` - Enhanced event planner (Tamil)
- `/enhanced-menu-selection` - Enhanced menu selection (English)
- `/enhanced-menu-selection/ta` - Enhanced menu selection (Tamil)

### Venue Management
- `/venue-selection` - Venue selection (English)
- `/venue-selection/ta` - Venue selection (Tamil)
- `/venue-details` - Venue details (English)
- `/venue-details/ta` - Venue details (Tamil)

### Session Management
- `/session-planner` - Session planner (English)
- `/session-planner/ta` - Session planner (Tamil)
- `/session-planning-standalone` - Standalone session planning (English)
- `/session-planning-standalone/ta` - Standalone session planning (Tamil)

### Event Components
- `/event-details` - Event details form (English)
- `/event-details/ta` - Event details form (Tamil)
- `/event-review` - Event review and summary (English)
- `/event-review/ta` - Event review and summary (Tamil)

### Menu Selection
- `/menu-selection-standalone` - Standalone menu selection (English)
- `/menu-selection-standalone/ta` - Standalone menu selection (Tamil)

### Simplified Components
- `/simplified-event-planner` - Simplified event planner (English)
- `/simplified-event-planner/ta` - Simplified event planner (Tamil)

## 🧩 Component Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   ├── ui/              # Reusable UI components
│   ├── MenuSelectionMicroservice.tsx
│   ├── SessionPlanningMicroservice.tsx
│   ├── IntegratedMenuAndSession.tsx
│   ├── EnhancedEventPlanner.tsx
│   ├── EnhancedMenuSelection.tsx
│   ├── VenueSelection.tsx
│   ├── VenueDetails.tsx
│   ├── SessionPlanner.tsx
│   ├── SessionPlanning.tsx
│   ├── EventDetails.tsx
│   ├── EventReview.tsx
│   ├── MenuSelection.tsx
│   ├── SimplifiedEventPlanner.tsx
│   └── EventPlanningFlow.tsx
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Admin.tsx        # Admin page
│   └── NotFound.tsx     # 404 page
├── contexts/
│   └── ThemeContext.tsx # Theme management
├── hooks/
│   └── use-mobile.tsx  # Mobile detection
├── services/            # API and business logic
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🎨 UI Components

The platform uses a comprehensive set of UI components built with:

- **Shadcn/ui** - Modern, accessible component library
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons

## 🌐 Language Support

### English (en)
- Primary interface language
- Comprehensive feature descriptions
- Professional terminology

### Tamil (தமிழ்)
- Native language support
- Cultural context awareness
- Localized user experience

## 🎯 Key Features

### Menu Selection
- Advanced filtering and search
- Dietary preference management
- Cost optimization
- Multiple selection modes
- Export/import functionality

### Session Planning
- Timeline management
- Headcount tracking
- Service staff allocation
- Dietary restrictions
- Cost estimation

### Venue Management
- Venue search and filtering
- Capacity planning
- Location services
- Booking management

### Event Planning
- Complete workflow management
- Progress tracking
- Data persistence
- Export capabilities
- Collaborative features

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd bkr-menu-magic

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=BKR Menu Magic
```

## 🔧 Development

### Code Structure
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Husky** for git hooks

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
```

## 📱 Responsive Design

The platform is designed to work seamlessly across all devices:

- **Mobile First** - Optimized for mobile devices
- **Tablet Friendly** - Enhanced tablet experience
- **Desktop Optimized** - Full-featured desktop interface
- **Touch Support** - Touch-friendly interactions

## 🎨 Theming

### Theme Modes
- **Light Theme** - Clean, professional appearance
- **Dark Theme** - Easy on the eyes, modern look
- **System Theme** - Automatically follows OS preference

### Customization
- CSS custom properties for easy theming
- Consistent color palette
- Accessible contrast ratios
- Smooth theme transitions

## 🔒 Security Features

- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure data handling
- Privacy-focused design

## 📊 Performance

- **Code Splitting** - Lazy loading of components
- **Image Optimization** - WebP support and lazy loading
- **Bundle Optimization** - Tree shaking and minification
- **Caching Strategies** - Efficient data caching
- **Progressive Enhancement** - Core functionality without JavaScript

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful component names
- Add proper documentation
- Ensure accessibility compliance
- Test across different devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Phone**: +91 8012686883
- **Email**: support@bkr.com
- **Documentation**: [Component Improvements](COMPONENT_IMPROVEMENTS.md)
- **Microservices**: [Microservices README](MICROSERVICES_README.md)

## 🔮 Roadmap

### Upcoming Features
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] AI-powered recommendations
- [ ] Integration with external services

### Planned Improvements
- [ ] Performance optimization
- [ ] Enhanced accessibility
- [ ] Additional language support
- [ ] Advanced customization options
- [ ] Enterprise features

---

**Built with ❤️ by the BKR Team**
