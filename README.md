# Rent-ez - AI-Powered Rental Marketplace

A comprehensive single-page rental marketplace web application where users can find and offer items/services for rent, powered by AI matching algorithms.

## 🚀 Features

### Core Functionality
- **Dual Tab Interface**: Toggle between "Rental Requests" (Craigslist-style) and "Available Rentals" (Flipkart-style)
- **AI Matching Engine**: NLP and image similarity analysis to suggest optimal matches
- **Real-time Chat**: Internal messaging system using Socket.IO
- **User Authentication**: Email/password and Google OAuth support
- **Location-based Filtering**: Geographic proximity search with customizable radius
- **Image Upload**: Cloudinary integration for listing photos
- **Responsive Design**: Mobile-first approach with Material-UI components

### Advanced Features
- **Smart Recommendations**: Context-aware matching using text similarity, location, and price compatibility
- **User Profiles**: Complete profile management with reviews and ratings
- **Moderation System**: Automated content moderation and user reporting
- **Real-time Notifications**: Match alerts and message notifications
- **Advanced Filtering**: Category, price range, location, and availability filters

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js (Google OAuth 2.0)
- **Real-time**: Socket.IO
- **File Storage**: Cloudinary
- **AI/ML**: Hugging Face Transformers, TensorFlow.js

### Frontend
- **Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios with React Query
- **Form Handling**: React Hook Form
- **Routing**: React Router v6
- **Real-time**: Socket.IO Client

### Infrastructure
- **Deployment**: Render
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary CDN
- **Monitoring**: Winston logging, error tracking
- **Security**: Rate limiting, input validation, CORS

## 📁 Project Structure

```
Rent-ez_DEMO/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Main application pages
│   │   ├── context/      # React Context providers
│   │   ├── services/     # API calls and utilities
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Helper functions
│   │   └── theme.js      # Material-UI theme configuration
├── server/               # Node.js backend
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Custom middleware
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Helper functions
│   │   └── config/       # Configuration files
└── shared/               # Shared types and utilities
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or cloud)
- Cloudinary account for image uploads
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Rent-ez_DEMO
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   **Server (.env)**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

   **Client (.env)**
   ```bash
   cp client/.env.example client/.env.local
   # Edit client/.env.local with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

### Environment Variables

#### Server (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token signing
- `GOOGLE_CLIENT_ID/SECRET`: Google OAuth credentials
- `CLOUDINARY_*`: Cloudinary configuration
- `REDIS_URL`: Redis connection for session storage

#### Client (.env.local)
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `REACT_APP_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name

## 📋 Available Scripts

### Root Level
- `npm run install:all` - Install dependencies for all packages
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm start` - Start the production server
- `npm test` - Run tests for both frontend and backend

### Server
- `cd server && npm run dev` - Start backend in development mode with nodemon
- `cd server && npm start` - Start backend in production mode
- `cd server && npm test` - Run backend tests
- `cd server && npm run test:watch` - Run tests in watch mode

### Client
- `cd client && npm start` - Start frontend development server
- `cd client && npm run build` - Build frontend for production
- `cd client && npm test` - Run frontend tests
- `cd client && npm run lint` - Run ESLint
- `cd client && npm run format` - Format code with Prettier

## 🔧 Development

### Database Setup

1. **MongoDB Local**
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod

   # Create database
   mongo
   use rent-ez
   ```

2. **MongoDB Atlas (Recommended)**
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Get connection string and add to `.env`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Add Client ID and Secret to environment variables

### Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Get cloud name, API key, and API secret
3. Add to environment variables

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
cd server && npm test

# Frontend tests only
cd client && npm test

# Test coverage
cd server && npm run test:coverage
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Rentals
- `GET /api/rentals` - Get available rentals
- `POST /api/rentals` - Create new rental (protected)
- `GET /api/rentals/:id` - Get rental details
- `PUT /api/rentals/:id` - Update rental (protected)
- `DELETE /api/rentals/:id` - Delete rental (protected)

### Requests
- `GET /api/requests` - Get rental requests
- `POST /api/requests` - Create new request (protected)
- `GET /api/requests/:id` - Get request details

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/conversations` - Start new conversation
- `GET /api/chat/conversations/:id/messages` - Get conversation messages

## 🚀 Deployment

### Render Deployment

1. **Connect Repository**
   - Connect your GitHub repository to Render

2. **Environment Variables**
   - Add all environment variables to Render dashboard

3. **Build Settings**
   - Build command: `npm run build`
   - Start command: `npm start`
   - Node version: 18

### Manual Deployment

```bash
# Build frontend
cd client && npm run build

# Start production server
cd .. && npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@rent-ez.com
- Check the [Wiki](https://github.com/your-repo/rent-ez/wiki) for documentation

## 🗺 Roadmap

- [x] Basic authentication and user management
- [x] Rental listing creation and browsing
- [x] Real-time chat functionality
- [ ] AI-powered matching algorithm
- [ ] Mobile app (React Native)
- [ ] Payment integration (Stripe)
- [ ] Review and rating system
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Multi-language support

---

Built with ❤️ by the Rent-ez team
