# Holidaze - Accommodation Booking Platform

A modern, responsive accommodation booking application built with React and TypeScript for the Noroff Front-End Development exam project.

<img width="945" alt="image" src="https://github.com/user-attachments/assets/e65672e7-8cc7-460b-9b13-cb37b62e7454" />


## 🌟 Overview

Holidaze is a comprehensive accommodation booking platform that serves both customers looking for vacation rentals and venue managers who want to list and manage their properties. The application provides a seamless booking experience with modern UI/UX design and smart data management.

## 🔗 Live Demo

**[🚀 View Live Site](https://rosarioba.github.io/holidaze-booking-app/)**

## 📋 Project Links

- 🔗 [Live Application](https://rosarioba.github.io/holidaze-booking-app/)
- 📱 [GitHub Repository](https://github.com/RosarioBA/holidaze-booking-app)
- 📊 [Kanban Board](your-kanban-link)
- 📈 [Gantt Chart](your-gantt-link)
- 🎨 [Figma Design](your-figma-link)
- 🎨 [Style Guide](your-style-guide-link)

## 📋 Project Requirements

This project was built to fulfill the requirements of the Noroff FED2 exam, demonstrating:

- ✅ Modern React development with TypeScript
- ✅ Responsive design with Tailwind CSS
- ✅ API integration with authentication
- ✅ User role management (Customer vs Venue Manager)
- ✅ Complete booking flow implementation
- ✅ Testing and deployment best practices

## ✨ Features

### For All Users
- 🏠 Browse and search venues with advanced filtering
- 🔍 View detailed venue information with image galleries
- 📅 Check availability with interactive calendar
- 👤 User registration and authentication
- 📱 Fully responsive design for all devices

### For Customers
- 🎯 Book accommodations with date selection
- 📋 View and manage upcoming bookings
- ❤️ Save favorite venues (persistent across sessions)
- 👤 Update profile, avatar, and banner
- 🏆 Personalized dashboard with recent activity

### For Venue Managers
- ➕ Create and list new venues with detailed information
- ✏️ Edit and update existing venues
- 🗑️ Delete venues they manage
- 📊 View booking analytics and customer information
- 📅 Manage bookings for their venues
- 💼 Comprehensive venue management dashboard

## 🛠️ Built With

### Core Technologies
- **React 18** - Modern UI library with hooks and context
- **TypeScript** - Type-safe JavaScript for better development
- **Vite** - Fast build tool and development server
- **React Router 6** - Client-side routing and navigation

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - Enhanced styling and animations
- **Google Fonts** - Averia Gruesa Libre & Lato typography
- **Responsive Design** - Mobile-first approach

### Development Tools
- **Git & GitHub** - Version control and collaboration
- **GitHub Pages** - Automated deployment

## 💾 Data Persistence

The application uses a hybrid approach for optimal performance and user experience:

### API Integration
- User authentication and profiles
- Venue data and bookings
- Real-time availability checking
- **User Avatars & Banners**: Synced across all devices

### Local Storage Features
- **Favorites/Saved Venues**: Stored locally for instant access and persistence across sessions
- **Recently Viewed Venues**: Tracked locally for personalized recommendations
- **Search Preferences**: User settings and filters

### Performance Optimizations
- **Avatar/Banner Caching**: Profile images cached locally for faster loading while syncing with API
- **Smart Data Loading**: Frequently accessed data loads from cache first, then syncs with server

### Benefits of This Approach
- ⚡ **Faster Performance**: Frequently accessed data loads instantly
- 🔄 **Cross-Device Sync**: Profile data available everywhere you log in
- 📱 **Better UX**: Smooth interactions without API delays
- 🎯 **Personalization**: User-specific data persists across sessions

> **Note**: Favorites are stored locally for optimal performance, while profile data syncs across devices via API integration.

## 🏗️ Project Structure

```
src/
├── api/                 # API service layer
│   ├── api.ts          # Base API configuration
│   ├── venueService.ts # Venue-related API calls
│   └── bookingService.ts # Booking management
├── components/          # Reusable React components
│   ├── common/         # Shared components (Pagination, Modals)
│   ├── layout/         # Layout components (Header, Navigation)
│   ├── profile/        # Profile-related components
│   └── venue/          # Venue-related components
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── FavoritesContext.tsx # Favorites management
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── customer/      # Customer dashboard pages
│   ├── venue-manager/ # Venue manager pages
│   └── venue/         # Venue browsing pages
├── routes/             # Routing configuration
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RosarioBA/holidaze-booking-app.git
   cd holidaze-booking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to http://localhost:5173

**Note:** The application is also available live at the [deployed site](https://rosarioba.github.io/holidaze-booking-app/).

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## 🔐 Authentication & API

The application integrates with the Noroff API v2 for comprehensive data management:

### Features
- User authentication and registration
- Venue data management
- Booking system
- Profile management with avatar/banner support

### User Roles
- **Customer**: Can browse and book venues, manage favorites
- **Venue Manager**: Can list and manage venues + all customer capabilities

### Registration Requirements
- Must use a `@stud.noroff.no` email address
- Choose account type during registration (Customer or Venue Manager)
- Secure JWT-based authentication

## 📱 Responsive Design

Holidaze is built with a mobile-first approach featuring:

- 📱 **Mobile Navigation**: Clean hamburger menu with smooth animations
- 🖥️ **Desktop Experience**: Rich layouts with sidebar navigation
- 🎯 **Touch-Friendly**: Optimized for mobile interactions
- ⚡ **Performance**: Optimized images and lazy loading
- ♿ **Accessibility**: WCAG compliant color schemes and navigation

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0081A7` - Brand color for buttons and accents
- **Dark Blue**: `#13262F` - Hover states and emphasis
- **Light Cream**: `#F5F7DC` - Secondary backgrounds
- **Background**: `#F8F9FA` - Main background color

### Typography
- **Headers**: Averia Gruesa Libre (decorative, brand identity)
- **Body Text**: Lato (clean, highly readable)
- **UI Elements**: System fonts for optimal performance

### Component Design
- Consistent spacing and border radius
- Subtle shadows and hover effects
- Loading states and skeleton screens
- Error handling with user-friendly messages

## 🧪 Testing & Quality Assurance

The application has been thoroughly tested for:

### Functionality Testing
- ✅ All user stories completed and verified
- ✅ Authentication flow (login, register, logout)
- ✅ Booking process from search to confirmation
- ✅ Venue management (create, edit, delete)
- ✅ Profile management and data persistence

### Technical Testing
- ✅ **HTML Validation**: All pages pass W3C validation
- ✅ **Lighthouse Scores**: Performance, Accessibility, Best Practices
- ✅ **WAVE Testing**: Accessibility compliance verified
- ✅ **Cross-Browser**: Tested on Chrome, Firefox, Safari, Edge
- ✅ **Responsive**: Tested across multiple device sizes

### User Experience Testing
- ✅ Navigation flow and user journeys
- ✅ Form validation and error handling
- ✅ Loading states and feedback
- ✅ Mobile usability and touch interactions

## 🚀 Deployment

The project uses automated deployment with GitHub Pages:

### Build Process
```bash
npm run build    # Creates optimized production build
npm run deploy   # Deploys to GitHub Pages
```

### Deployment Features
- 🔄 **Automated Builds**: Triggered on main branch updates
- 🌐 **CDN Distribution**: Fast global content delivery
- 📱 **Mobile Optimization**: Compressed assets and images
- 🔒 **HTTPS**: Secure connection for all users

**Live URL**: https://rosarioba.github.io/holidaze-booking-app/

## 📂 Project Management

### Planning & Design
- **Kanban Board**: GitHub Projects for agile task management
- **Gantt Chart**: Timeline tracking and milestone management
- **Figma Design**: Complete UI/UX design system and prototypes
- **Style Guide**: Comprehensive design documentation

### Development Workflow
1. **Feature Planning**: User stories and technical requirements
2. **Design Implementation**: Figma to code conversion
3. **Development**: Feature branches with regular commits
4. **Testing**: Manual and automated testing procedures
5. **Code Review**: Quality assurance and best practices
6. **Deployment**: Automated build and deployment process

## 🤝 Contributing

This is an educational project, but feedback and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a school assignment and is for educational purposes only.

## 🙏 Acknowledgments

- **Noroff School of Technology** - For project requirements and comprehensive API
- **Design Inspiration** - Modern booking platforms like Airbnb and Booking.com
- **Open Source Community** - For excellent tools, libraries, and best practices
- **React & TypeScript Communities** - For documentation and learning resources

## 📞 Contact

**Rosario** - [GitHub Profile](https://github.com/RosarioBA)

---

⭐ **If you found this project interesting or useful, please give it a star!**

*Built with ❤️ for the Noroff Front-End Development Program*
