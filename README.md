# BKR Menu Magic - Enhanced Catering Website

A modern, responsive catering website with comprehensive event planning tools, enhanced menu selection, and an admin dashboard for booking management.

## ✨ Features

### 🎨 Enhanced Design & Colors
- **Vibrant Color Scheme**: Beautiful amber, orange, and rose gradients throughout the interface
- **Modern UI**: Clean, professional design with smooth animations and transitions
- **Responsive Design**: Optimized for all devices and screen sizes
- **Dark/Light Theme**: Toggle between themes with system preference detection

### 🍽️ Enhanced Menu Selection
- **Comprehensive Menu**: 500+ South Indian dishes organized by categories
- **Smart Search**: Search by dish name, category, or ingredients
- **Category Filters**: Browse by meal type (Breakfast, Lunch, Dinner, etc.)
- **Vegetarian Filter**: Toggle to show only vegetarian options
- **Interactive Selection**: Expandable categories with easy item selection
- **Real-time Summary**: Live count of selected items and categories

### 🎯 Admin Dashboard
- **Booking Management**: View and manage all event bookings
- **Editable Details**: Modify client information, venue details, and event dates
- **Status Tracking**: Track booking status (Pending, Confirmed, Completed, Cancelled)
- **Advanced Filtering**: Search by name, phone, venue, date, or status
- **Responsive Interface**: Mobile-friendly admin panel
- **Bilingual Support**: Available in English and Tamil

### 📅 Event Planning Tools
- **Multi-day Events**: Plan events spanning multiple days
- **Session Management**: Organize meals by breakfast, lunch, dinner, etc.
- **Head Count Tracking**: Manage guest numbers for each session
- **Menu Integration**: Seamlessly integrate with the enhanced menu selection
- **PDF Generation**: Generate event plans in English and Tamil

### 🌐 Bilingual Support
- **English & Tamil**: Full interface support for both languages
- **Dynamic Content**: All text, labels, and messages in both languages
- **Cultural Adaptation**: Proper Tamil translations for catering terminology

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd bkr-menu-magic

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: React hooks + Context API
- **Build Tool**: Vite

## 📱 Admin Access

### Admin Dashboard Routes
- **English**: `/admin`
- **Tamil**: `/admin/ta`

### Features Available
- View all bookings with detailed information
- Edit client details, venue information, and event dates
- Update booking status
- Search and filter bookings
- Manage menu selections for each event

## 🎨 Design System

### Color Palette
- **Primary**: Vibrant amber and orange gradients
- **Secondary**: Warm rose and pink tones
- **Accent**: Blue, green, and purple for highlights
- **Neutral**: Sophisticated grays and whites

### Typography
- **Font Family**: Inter (with system fallbacks)
- **Weights**: Light, Regular, Medium, Semibold, Bold
- **Scaling**: Responsive typography system

### Components
- **Cards**: Elevated with shadows and gradients
- **Buttons**: Multiple variants with hover effects
- **Forms**: Clean, accessible form controls
- **Navigation**: Sticky header with smooth animations

## 📊 Menu Categories

### Main Categories
- **Sweets**: Laddu, Cake, Mysore Pak, Jilabi, Rolls
- **Starters**: Paneer dishes, Samosa, Momos, BBQ
- **Main Course**: Rice varieties, Biryani, Gravy dishes
- **Breads**: Roti, Naan, Parotta, Dosa
- **Beverages**: Welcome drinks, Hot beverages
- **Special Items**: Chettinad specialties, Regional dishes

### Dietary Information
- **Vegetarian Options**: Clearly marked with green indicators
- **Non-vegetarian Options**: Marked with red indicators
- **Allergen Information**: Available for each dish

## 🔧 Customization

### Adding New Menu Items
1. Update `src/data/menuData.ts`
2. Add new categories and items
3. Include both English and Tamil names
4. Set vegetarian status

### Modifying Colors
1. Update CSS variables in `src/index.css`
2. Modify Tailwind config in `tailwind.config.ts`
3. Use the new gradient and shadow utilities

### Adding New Features
1. Create new components in `src/components/`
2. Add routes in `src/App.tsx`
3. Update navigation in `src/components/Navigation.tsx`

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly interface
- Swipe gestures for navigation
- Optimized layouts for small screens
- Mobile-first admin dashboard

## 🌟 Performance Features

- **Lazy Loading**: Components load on demand
- **Optimized Images**: Responsive image handling
- **Smooth Animations**: 60fps animations with Framer Motion
- **Efficient Rendering**: React 18 concurrent features
- **Bundle Optimization**: Vite build optimization

## 🔒 Security Considerations

- **Input Validation**: All form inputs are validated
- **XSS Protection**: React's built-in XSS protection
- **Secure Routing**: Protected admin routes
- **Data Sanitization**: Proper data handling

## 📈 Future Enhancements

- **User Authentication**: Login system for admin access
- **Database Integration**: Real-time data persistence
- **Payment Integration**: Online payment processing
- **Analytics Dashboard**: Booking analytics and reports
- **Mobile App**: Native mobile application
- **API Development**: RESTful API for external integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- **Phone**: +91 8012686883
- **Email**: [Contact through website]
- **Website**: [Your website URL]

---

**Built with ❤️ for BKR Catering Excellence**
