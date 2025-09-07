# SMIT Campus Marketplace

A full-stack MERN application that serves as an exclusive OLX-clone for SMIT students to buy and sell used goods like books and electronics. The platform provides a structured solution to replace disorganized social media groups for campus trading.

## 🚀 Features

### Core Features
- **Campus-Verified Authentication**: SMIT email domain verification (@smit.edu.pk, @smit.ac.in)
- **Product Listings**: Create detailed listings with multiple photos, descriptions, and pricing
- **Advanced Search & Filtering**: Search by text, filter by category, condition, and price range
- **User Dashboard**: Manage personal listings with ownership controls
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Security & Ownership
- **JWT Authentication**: Secure token-based authentication
- **Ownership Rules**: Users can only edit/delete their own listings
- **Campus Email Verification**: Email verification required for account activation
- **File Upload Security**: Image validation and size limits

### Search & Filter Capabilities
- **Text Search**: Full-text search across titles, descriptions, and tags
- **Category Filtering**: Filter by product categories (Books, Electronics, etc.)
- **Condition Filtering**: Filter by item condition (New, Like New, Good, Fair, Poor)
- **Price Range**: Filter by minimum and maximum price
- **Sorting Options**: Sort by newest, price (low to high/high to low), most viewed

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Nodemailer** for email verification
- **bcryptjs** for password hashing

### Frontend
- **React.js** with Hooks
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SIGIL-OLX
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/campus-marketplace
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   PORT=5000
   
   # Email configuration for campus verification
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CAMPUS_EMAIL_DOMAIN=smit.edu.pk
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Start the backend server**
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start the React development server**
   ```bash
   npm start
   ```

### Full Application Setup

Run both frontend and backend concurrently:
```bash
npm run dev
```

## 🏗️ Project Structure

```
SIGIL-OLX/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.js
│   └── package.json
├── models/                 # MongoDB models
│   ├── User.js
│   └── Product.js
├── routes/                 # Express routes
│   ├── auth.js
│   ├── products.js
│   └── users.js
├── middleware/             # Custom middleware
│   ├── auth.js
│   └── upload.js
├── uploads/                # File upload directory
│   └── products/
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify/:token` - Verify email
- `GET /api/auth/me` - Get current user

### Product Routes
- `GET /api/products` - Get all products with filters
- `POST /api/products` - Create new product (auth required)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)
- `GET /api/products/my/listings` - Get user's listings (auth required)

### User Routes
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update profile (auth required)
- `GET /api/users/:id/public` - Get public user profile
- `GET /api/users/:id/products` - Get user's public listings

## 🎯 Key Features Implementation

### Campus Authentication
- Email domain validation for SMIT accounts
- Email verification with secure tokens
- JWT-based session management

### Advanced Search System
```javascript
// Text search with MongoDB
query.$text = { $search: searchQuery };

// Category and condition filtering
if (category !== 'All') query.category = category;
if (condition !== 'All') query.condition = condition;

// Price range filtering
if (minPrice || maxPrice) {
  query.price = {};
  if (minPrice) query.price.$gte = parseFloat(minPrice);
  if (maxPrice) query.price.$lte = parseFloat(maxPrice);
}
```

### Ownership Protection
```javascript
// Middleware checks ownership before allowing modifications
if (product.owner.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: 'Not authorized' });
}
```

### File Upload Security
- Image file type validation
- File size limits (5MB per image)
- Maximum 5 images per product
- Secure file naming

## 🔒 Security Features

- **Input Validation**: Express-validator for request validation
- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **File Security**: Image type and size validation
- **Email Verification**: Prevents fake accounts
- **Password Hashing**: bcryptjs for secure password storage

## 📱 User Interface

### Key Pages
1. **Home Page**: Product browsing with search and filters
2. **Authentication**: Login/Register with campus email
3. **Product Details**: Detailed view with seller contact
4. **Create Listing**: Form to add new products
5. **Dashboard**: Manage personal listings
6. **Profile**: User account management

### UI/UX Features
- Responsive Material-UI design
- Image galleries and previews
- Real-time search and filtering
- Pagination for large datasets
- Loading states and error handling

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_url
JWT_SECRET=your_production_jwt_secret
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password
```

### Build Commands
```bash
# Build React app
cd client && npm run build

# Start production server
npm start
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with campus email
- [ ] Email verification process
- [ ] User login/logout
- [ ] Product creation with images
- [ ] Search and filter functionality
- [ ] Product editing (owner only)
- [ ] Product deletion (owner only)
- [ ] Dashboard management
- [ ] Profile updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**SMIT Campus Marketplace Team**
- Full-stack MERN development
- UI/UX design
- Database architecture
- Security implementation

## 🔮 Future Enhancements

- Real-time chat between buyers and sellers
- Push notifications for new listings
- Advanced user ratings and reviews
- Mobile app development
- Integration with campus payment systems
- AI-powered product recommendations
- Bulk listing management
- Analytics dashboard for sellers

## 📞 Support

For support, email your.support@smit.edu.pk or create an issue in this repository.

---

**Made with ❤️ for the SMIT Campus Community**
