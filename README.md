# Food Ordering System

A full-stack role-based food ordering web application with country-based access control (Re-BAC).

## Features

- **Role-Based Access Control (RBAC)**: Admin, Manager, and Member roles with different permissions
- **Relational Access Control (Re-BAC)**: Country-based access restrictions (India/America)
- **JWT Authentication**: Secure token-based authentication
- **GraphQL API**: Modern API with type-safe queries and mutations
- **Real-time Updates**: Automatic cache invalidation and data refresh
- **Payment Processing**: Card management and payment simulation
- **Responsive UI**: Modern, mobile-friendly interface with Tailwind CSS

## Tech Stack

### Backend
- **NestJS**: Progressive Node.js framework
- **GraphQL**: API query language with Apollo Server
- **Prisma**: Next-generation ORM for PostgreSQL
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **TypeScript**: Type-safe development

### Frontend
- **Next.js**: React framework with SSR
- **Apollo Client**: GraphQL client
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development

### Database
- **PostgreSQL**: Relational database

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd food-ordering-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/food_ordering_db"
JWT_SECRET="your-secret-key-change-in-production"
```

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database with test data
npx prisma db seed

# Start the backend server
npm run start:dev
```

Backend will run on: `http://localhost:4000/graphql`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

Edit `.env.local` file:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

```bash
# Start the frontend server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## Test Users

The seed script creates the following test users (password: `password`):

| Name | Email | Role | Country |
|------|-------|------|---------|
| Nick Fury | nick.fury@slooze.xyz | ADMIN | - |
| Captain Marvel | captain.marvel@slooze.xyz | MANAGER | INDIA |
| Captain America | captain.america@slooze.xyz | MANAGER | AMERICA |
| Thanos | thanos@slooze.xyz | MEMBER | INDIA |
| Thor | thor@slooze.xyz | MEMBER | INDIA |
| Travis | travis@slooze.xyz | MEMBER | AMERICA |

## User Permissions

### Admin
- View all restaurants (both countries)
- View all orders (global)
- Checkout and cancel any order
- Add/edit/delete payment methods

### Manager
- View restaurants in their country only
- View orders from their country (own + members)
- Checkout and cancel orders
- View payment methods (cannot modify)

### Member
- View restaurants in their country only
- View only their own orders
- Create orders
- Cannot checkout or cancel orders
- View payment methods (cannot modify)

## API Documentation

### Authentication

#### Login
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    email
    name
    role
    country
    token
  }
}
```

### Restaurants

#### Get Restaurants
```graphql
query GetRestaurants {
  restaurants {
    id
    name
    description
    country
    menuItems {
      id
      name
      description
      price
    }
  }
}
```

### Orders

#### Get My Orders
```graphql
query GetMyOrders {
  myOrders {
    id
    status
    totalAmount
    createdAt
    user {
      id
      name
      role
    }
    orderItems {
      id
      quantity
      price
      menuItem {
        id
        name
      }
    }
  }
}
```

#### Create Order
```graphql
mutation CreateOrder($restaurantId: String!, $items: [OrderItemInput!]!) {
  createOrder(restaurantId: $restaurantId, items: $items) {
    id
    status
    totalAmount
  }
}
```

#### Checkout Order
```graphql
mutation CheckoutOrder($orderId: String!) {
  checkoutOrder(orderId: $orderId) {
    id
    status
  }
}
```

#### Cancel Order
```graphql
mutation CancelOrder($orderId: String!) {
  cancelOrder(orderId: $orderId) {
    id
    status
  }
}
```

### Payment Methods

#### Get Payment Methods
```graphql
query GetPaymentMethods {
  myPaymentMethods {
    id
    cardNumber
    cardHolder
    expiryDate
    isDefault
  }
}
```

#### Add Payment Method
```graphql
mutation AddPaymentMethod($cardNumber: String!, $cardHolder: String!, $expiryDate: String!) {
  addPaymentMethod(cardNumber: $cardNumber, cardHolder: $cardHolder, expiryDate: $expiryDate) {
    id
    cardNumber
    cardHolder
  }
}
```

#### Update Payment Method
```graphql
mutation UpdatePaymentMethod($id: String!, $cardNumber: String, $cardHolder: String, $expiryDate: String) {
  updatePaymentMethod(id: $id, cardNumber: $cardNumber, cardHolder: $cardHolder, expiryDate: $expiryDate) {
    id
    cardNumber
    cardHolder
    expiryDate
  }
}
```

#### Delete Payment Method
```graphql
mutation DeletePaymentMethod($id: String!) {
  deletePaymentMethod(id: $id)
}
```

## Database Schema

### User
- id: String (UUID)
- email: String (unique)
- password: String (hashed)
- name: String
- role: Enum (ADMIN, MANAGER, MEMBER)
- country: Enum (INDIA, AMERICA) - nullable for Admin
- createdAt: DateTime

### Restaurant
- id: String (UUID)
- name: String
- description: String
- country: Enum (INDIA, AMERICA)
- createdAt: DateTime

### MenuItem
- id: String (UUID)
- name: String
- description: String
- price: Float
- restaurantId: String (FK)
- createdAt: DateTime

### Order
- id: String (UUID)
- userId: String (FK)
- restaurantId: String (FK)
- status: Enum (PENDING, CONFIRMED, CANCELLED)
- totalAmount: Float
- createdAt: DateTime

### OrderItem
- id: String (UUID)
- orderId: String (FK)
- menuItemId: String (FK)
- quantity: Int
- price: Float

### PaymentMethod
- id: String (UUID)
- userId: String (FK)
- cardNumber: String
- cardHolder: String
- expiryDate: String
- isDefault: Boolean
- createdAt: DateTime

## Build for Production

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Project Structure

```
food-ordering-system/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── models/        # GraphQL models
│   │   ├── order/         # Order module
│   │   ├── payment/       # Payment module
│   │   ├── prisma/        # Prisma service
│   │   ├── restaurant/    # Restaurant module
│   │   └── main.ts        # Entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Seed data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── lib/           # Apollo client & queries
│   │   ├── pages/         # Next.js pages
│   │   └── styles/        # Global styles
│   └── package.json
└── README.md
```

## Security Features

- JWT-based authentication with 7-day expiry
- Password hashing with bcrypt
- Role-based access control
- Country-based access restrictions
- Input validation for card numbers and expiry dates
- Protected GraphQL resolvers with guards

## License

MIT
