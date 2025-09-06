# EcoFinds - Sustainable Second-Hand Marketplace

A modern, responsive web application for buying and selling sustainable second-hand items. Built with Next.js, TypeScript, and TailwindCSS.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure JWT-based auth with email/password signup and login
- **Product Management**: Full CRUD operations for product listings with image upload
- **Real-time Search**: Live search with category filtering and sorting
- **Shopping Cart**: Add/remove items with real-time counter in navbar
- **Order Management**: Complete checkout process and order history
- **User Dashboard**: Profile management and account settings
- **Image Upload**: Drag-and-drop photo upload for product listings

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live search results and cart counter updates
- **Secure Authentication**: JWT tokens with httpOnly cookies and bcrypt password hashing
- **Database Integration**: SQLite with Prisma ORM for development
- **Input Validation**: Zod schema validation on both client and server
- **Type Safety**: Full TypeScript implementation

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (development) / PostgreSQL (production) with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod for input validation
- **Styling**: TailwindCSS for responsive UI

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mainakgit0/coderz_ecofinds.git
   cd coderz_ecofinds
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file with these values:
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Seed the database with sample data
   npx tsx prisma/seed.ts
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Sample Accounts

The seed script creates two sample accounts for testing:

- **Email**: `alice@example.com` | **Password**: `Password123!`
- **Email**: `bob@example.com` | **Password**: `Password123!`

## 🗂 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User management
│   │   ├── products/      # Product CRUD
│   │   ├── cart/          # Shopping cart
│   │   ├── orders/        # Order management
│   │   └── upload/        # Image upload
│   ├── auth/              # Auth pages (login/signup)
│   ├── cart/              # Shopping cart page
│   ├── dashboard/         # User dashboard
│   ├── marketplace/       # Main marketplace page
│   ├── my/listings/       # User's product listings
│   ├── orders/            # Order history
│   └── product/[id]/      # Product detail pages
├── components/            # Reusable UI components
├── contexts/              # React contexts (Auth, Cart, Theme)
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   └── validations.ts    # Zod schemas
└── prisma/               # Database schema and migrations
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Access (15min) + Refresh (7d) tokens
- **Secure Cookies**: httpOnly, secure, sameSite settings
- **Input Validation**: Server-side validation with Zod
- **CORS Protection**: Configured for production deployment
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 📊 Database Schema

### Models
- **User**: Authentication and profile data
- **Product**: Product listings with categories and detailed information
- **Order**: Purchase records
- **OrderItem**: Individual items in orders
- **CartItem**: Shopping cart functionality

### Categories
- Clothing
- Electronics  
- Furniture
- Books
- Accessories
- Other

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile
- `DELETE /api/users/delete` - Delete user account

### Products
- `GET /api/products` - List products (with search/filter)
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart & Orders
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove from cart
- `POST /api/orders` - Checkout (create order)
- `GET /api/orders/me` - Get user's orders

### Upload
- `POST /api/upload` - Upload product images

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
```bash
DATABASE_URL="postgresql://..."  # PostgreSQL connection string
JWT_SECRET="your-production-secret-key"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.
