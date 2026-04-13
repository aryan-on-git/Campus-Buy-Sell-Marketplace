# CampusBuy - Campus Marketplace

An OLX-style marketplace web application designed for college students to buy and sell products locally.

## 🎯 Features

- **User Authentication** - Secure signup/login with JWT tokens
- **Product Listings** - Create, read, update, delete product listings
- **Search & Filters** - Search by name and filter by category
- **User Authorization** - Users can only edit/delete their own listings
- **Product Management** - View and manage all your listings
- **Responsive Design** - Works seamlessly on desktop and mobile
- **RESTful APIs** - Well-structured and documented API endpoints

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing, CORS, Input validation

## 📋 Prerequisites

- Node.js v16 or higher
- MongoDB Atlas account (free)
- Git

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd campus-buy-sell-marketplace
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Set up a database user with username and password
4. Allow network access from anywhere
5. Copy your connection string

### 4. Create .env file
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/campusmarketplace?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here_make_it_random
NODE_ENV=development
```

### 5. Start the server
```bash
npm start
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
campus-buy-sell-marketplace/
├── models/              # MongoDB schemas
│   ├── User.js         # User schema with authentication
│   └── Product.js      # Product schema
├── routes/              # API endpoints
│   ├── auth.js         # Authentication routes
│   └── products.js     # Product CRUD routes
├── middleware/          # Custom middleware
│   └── auth.js         # JWT verification & authorization
├── public/              # Frontend files
│   ├── index.html      # Homepage
│   ├── auth.html       # Login/Signup page
│   ├── browse.html     # Product browse page
│   ├── my-products.html # User's listings page
│   ├── styles.css      # Homepage styles
│   ├── auth.css        # Auth page styles
│   ├── browse.css      # Browse page styles
│   ├── my-products.css # My products page styles
│   ├── auth.js         # Auth form handling
│   ├── browse.js       # Browse and search logic
│   └── my-products.js  # Product management logic
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── API_DOCS.md         # API documentation
└── README.md           # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/user/my-products` - Get user's products
- `POST /api/products` - Create product (authenticated)
- `PUT /api/products/:id` - Update product (authenticated)
- `DELETE /api/products/:id` - Delete product (authenticated)

**For detailed API documentation, see [API_DOCS.md](./API_DOCS.md)**

## 💡 Usage

### As a Buyer
1. Visit homepage at `http://localhost:5000`
2. Click "Sign Up" to create account
3. Go to "Browse" to view all products
4. Use search and filters to find products
5. View product details

### As a Seller
1. Create account
2. Navigate to "Browse" (from navbar, click "Sell")
3. Fill product details and create listing
4. Go to "My Products" to manage listings
5. Edit or delete listings as needed

## 🔐 Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **JWT Authentication** - Stateless token-based auth
- **Authorization Checks** - Users can only modify their own products
- **Input Validation** - Server-side validation on all inputs
- **CORS Enabled** - Cross-origin requests handled securely
- **Environment Variables** - Sensitive data in .env file

## 📊 Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  college: String (required),
  phone: String (required),
  createdAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  category: String (enum),
  price: Number,
  condition: String (enum),
  seller: ObjectId (ref: User),
  isAvailable: Boolean,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing the API

You can test the API using curl, Postman, or VS Code REST Client.

**Example - Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "college": "IIT Delhi",
    "phone": "9876543210"
  }'
```

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack development with Node.js and MongoDB
- RESTful API design principles
- User authentication and authorization
- Database schema design
- Responsive UI/UX
- Error handling and validation
- Security best practices

## 🚀 Future Enhancements

- Image uploads for products
- User profiles and ratings
- In-app messaging between buyers and sellers
- Payment integration
- Admin panel for moderation
- Email verification
- Advanced analytics

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

[Your Name]

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Happy coding! Good luck with your interview! 🎉**
