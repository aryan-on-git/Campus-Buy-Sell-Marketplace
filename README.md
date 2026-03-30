# CampusBuy - Campus Marketplace

An OLX-style marketplace web application designed for college students to buy and sell products locally.

## Features

- **User Authentication**: Secure login and signup with JWT
- **Product Listings**: Create, read, update, delete product listings
- **Search & Filters**: Search by product name and filter by category
- **User Authorization**: Users can only edit/delete their own listings
- **Responsive Design**: Works on desktop and mobile devices
- **RESTful APIs**: Well-structured API endpoints

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd campus-buy-sell-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file based on `.env.example`
   - Add your MongoDB Atlas connection string
   - Generate a JWT secret

4. **Start the server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

## Project Structure

```
campus-buy-sell-marketplace/
├── public/              # Frontend files (HTML, CSS, JS)
├── models/              # MongoDB schemas
├── routes/              # API endpoints
├── middleware/          # Authentication & authorization
├── server.js            # Main server file
├── package.json         # Dependencies
└── README.md           # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (authenticated)
- `PUT /api/products/:id` - Update product (authenticated)
- `DELETE /api/products/:id` - Delete product (authenticated)

### Search & Filters
- `GET /api/products/search?q=keyword` - Search products
- `GET /api/products/category/:category` - Filter by category

## Getting Started

1. Install Node.js (v16 or higher)
2. Set up MongoDB Atlas (free account at mongodb.com)
3. Follow the Installation steps above

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
