# CampusBuy API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## Authentication Endpoints

### 1. User Signup
**Endpoint:** `POST /auth/signup`  
**Access:** Public  
**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "college": "IIT Delhi",
  "phone": "9876543210"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "college": "IIT Delhi",
    "phone": "9876543210"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. User Login
**Endpoint:** `POST /auth/login`  
**Access:** Public  
**Description:** Login with email and password

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "college": "IIT Delhi",
    "phone": "9876543210"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## Product Endpoints

### 3. Get All Products
**Endpoint:** `GET /products`  
**Access:** Public  
**Description:** Retrieve all available products with optional search and filters

**Query Parameters:**
- `search` (optional): Search term for product name or description
- `category` (optional): Filter by category (books, electronics, furniture, clothing, sports, other)

**Examples:**
```
GET /products
GET /products?search=laptop
GET /products?category=electronics
GET /products?search=book&category=books
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Used Laptop",
      "description": "Good condition laptop, rarely used",
      "category": "electronics",
      "price": 25000,
      "condition": "good",
      "seller": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "college": "IIT Delhi"
      },
      "isAvailable": true,
      "views": 15,
      "createdAt": "2026-04-13T10:30:00Z"
    }
  ]
}
```

---

### 4. Get Products by Category
**Endpoint:** `GET /products/category/:category`  
**Access:** Public  
**Description:** Get products filtered by specific category with pagination

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)

**Example:**
```
GET /products/category/electronics?page=1&limit=12
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "total": 23,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

---

### 5. Get Single Product
**Endpoint:** `GET /products/:id`  
**Access:** Public  
**Description:** Get detailed information about a specific product (increments view count)

**Example:**
```
GET /products/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Used Laptop",
    "description": "Good condition laptop",
    "category": "electronics",
    "price": 25000,
    "condition": "good",
    "seller": {...},
    "isAvailable": true,
    "views": 16,
    "createdAt": "2026-04-13T10:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 6. Create Product
**Endpoint:** `POST /products`  
**Access:** Private (Authentication Required)  
**Description:** Create a new product listing

**Request Body:**
```json
{
  "name": "Used Laptop",
  "description": "Core i5, 8GB RAM, good condition",
  "category": "electronics",
  "price": 25000,
  "condition": "good"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product listed successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Used Laptop",
    "description": "Core i5, 8GB RAM, good condition",
    "category": "electronics",
    "price": 25000,
    "condition": "good",
    "seller": "507f1f77bcf86cd799439011",
    "isAvailable": true,
    "views": 0,
    "createdAt": "2026-04-13T10:35:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Please provide a product name"
}
```

---

### 7. Get My Products
**Endpoint:** `GET /products/user/my-products`  
**Access:** Private (Authentication Required)  
**Description:** Get all products listed by the current user

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

### 8. Update Product
**Endpoint:** `PUT /products/:id`  
**Access:** Private (Authentication Required)  
**Description:** Update a product (only seller can update)

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 30000,
  "isAvailable": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {...}
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to perform this action"
}
```

---

### 9. Delete Product
**Endpoint:** `DELETE /products/:id`  
**Access:** Private (Authentication Required)  
**Description:** Delete a product (only seller can delete)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Not authorized to perform this action"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Invalid or missing authentication token |
| 403 | Forbidden - Authenticated but not authorized |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

**Common Errors:**

1. **Missing Token**
   - Code: 401
   - Message: "Not authorized to access this route"

2. **Invalid Token**
   - Code: 401
   - Message: "Not authorized to access this route"

3. **Validation Error**
   - Code: 400
   - Message: "Please provide all required fields"

4. **Not Owner**
   - Code: 403
   - Message: "Not authorized to perform this action"

---

## Example Usage

### Signup and Get Token
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

### Get All Products
```bash
curl -X GET "http://localhost:5000/api/products?search=laptop"
```

### Create Product (with token)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "Used laptop in good condition",
    "category": "electronics",
    "price": 25000,
    "condition": "good"
  }'
```

---

## Data Validation

### Product Categories
- `books`
- `electronics`
- `furniture`
- `clothing`
- `sports`
- `other`

### Product Condition
- `new` - Brand new, unused
- `like-new` - Practically new
- `good` - Light wear, fully functional
- `fair` - Moderate wear, fully functional

### Constraints
- Product name: 5-100 characters
- Description: 10-1000 characters
- Price: Must be >= 0
- Phone: 10 digits
- Password: Minimum 6 characters
