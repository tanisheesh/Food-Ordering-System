# Architecture & Design Document

## System Overview

The Food Ordering System is a full-stack web application implementing Role-Based Access Control (RBAC) and Relational Access Control (Re-BAC) for managing food orders across multiple countries.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js Application                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │   Pages    │  │ Components │  │   Apollo   │    │  │
│  │  │            │  │            │  │   Client   │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ GraphQL over HTTP
                            │ JWT Authentication
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              NestJS Application                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │  GraphQL   │  │    JWT     │  │  Business  │    │  │
│  │  │  Resolvers │  │   Guard    │  │   Logic    │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │  ┌────────────────────────────────────────────┐    │  │
│  │  │           Prisma ORM                        │    │  │
│  │  └────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Users │ Restaurants │ Orders │ Payments │ MenuItems │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Layer
- **Next.js 14**: React framework with SSR and SSG capabilities
- **Apollo Client**: GraphQL client with caching and state management
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Static type checking

### Backend Layer
- **NestJS**: Enterprise-grade Node.js framework
- **Apollo Server**: GraphQL server implementation
- **Prisma**: Type-safe ORM for database operations
- **JWT**: Stateless authentication
- **bcrypt**: Password hashing

### Database Layer
- **PostgreSQL**: ACID-compliant relational database

## Design Patterns

### 1. Module Pattern (Backend)
Each feature is organized as a self-contained module:
- Auth Module
- Restaurant Module
- Order Module
- Payment Module

### 2. Repository Pattern
Prisma acts as the repository layer, abstracting database operations.

### 3. Guard Pattern
JWT authentication is implemented using NestJS guards that intercept requests.

### 4. Service Layer Pattern
Business logic is separated into service classes:
- AuthService
- RestaurantService
- OrderService
- PaymentService

## Access Control Design

### Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────┐
│                    User Roles                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ADMIN                                                   │
│  ├── View all restaurants (global)                      │
│  ├── View all orders (global)                           │
│  ├── Checkout/cancel any order                          │
│  └── Manage payment methods                             │
│                                                          │
│  MANAGER                                                 │
│  ├── View restaurants (country-specific)                │
│  ├── View orders (country-specific)                     │
│  ├── Checkout/cancel orders                             │
│  └── View payment methods (read-only)                   │
│                                                          │
│  MEMBER                                                  │
│  ├── View restaurants (country-specific)                │
│  ├── View own orders only                               │
│  ├── Create orders                                      │
│  └── View payment methods (read-only)                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Relational Access Control (Re-BAC)

Country-based access restrictions:

```
User Country: INDIA
├── Can access: Indian restaurants
├── Can order from: Indian restaurants only
└── Manager sees: Orders from Indian users

User Country: AMERICA
├── Can access: American restaurants
├── Can order from: American restaurants only
└── Manager sees: Orders from American users

User Role: ADMIN (no country)
├── Can access: All restaurants
├── Can order from: Any restaurant
└── Sees: All orders globally
```

## Authentication Flow

```
1. User Login
   ├── Frontend sends email/password
   ├── Backend validates credentials
   ├── Backend generates JWT token
   │   └── Payload: { userId, role, country }
   └── Frontend stores token in localStorage

2. Authenticated Request
   ├── Frontend adds token to Authorization header
   ├── JwtAuthGuard intercepts request
   ├── Guard verifies token signature
   ├── Guard extracts user info from token
   └── Request proceeds with user context

3. Token Expiry
   ├── Token expires after 7 days
   ├── User must re-login
   └── New token is issued
```

## Data Flow

### Order Creation Flow

```
1. User adds items to cart (Frontend)
   └── State managed in React component

2. User clicks "Create Order"
   ├── Frontend sends GraphQL mutation
   │   └── Variables: restaurantId, items[]
   │
   ├── Backend validates:
   │   ├── User exists
   │   ├── Restaurant exists
   │   ├── User has access to restaurant (Re-BAC)
   │   └── Menu items exist
   │
   ├── Backend calculates total amount
   │
   ├── Backend creates order in database
   │   ├── Order record (status: PENDING)
   │   └── OrderItem records
   │
   └── Backend returns order data

3. Frontend updates UI
   ├── Shows success message
   ├── Clears cart
   └── Redirects to orders page
```

### Checkout Flow

```
1. User clicks "Checkout & Pay"
   ├── Frontend checks payment methods exist
   │   └── If none: Show error
   │
   └── Frontend shows payment modal

2. User selects payment method
   └── Frontend shows 5-second animation

3. Frontend sends checkout mutation
   ├── Backend validates:
   │   ├── User has permission (Admin/Manager only)
   │   ├── Order exists
   │   └── Order status is PENDING
   │
   ├── Backend updates order status to CONFIRMED
   │
   └── Backend returns updated order

4. Frontend updates UI
   ├── Shows success message
   └── Refreshes order list
```

## Database Design

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐
│    User     │         │  Restaurant  │
├─────────────┤         ├──────────────┤
│ id          │         │ id           │
│ email       │         │ name         │
│ password    │         │ description  │
│ name        │         │ country      │
│ role        │         │ createdAt    │
│ country     │         └──────────────┘
│ createdAt   │                │
└─────────────┘                │
      │                        │
      │ 1:N                    │ 1:N
      │                        │
      ▼                        ▼
┌─────────────┐         ┌──────────────┐
│    Order    │◄────────┤   MenuItem   │
├─────────────┤   N:1   ├──────────────┤
│ id          │         │ id           │
│ userId      │         │ name         │
│ restaurantId│         │ description  │
│ status      │         │ price        │
│ totalAmount │         │ restaurantId │
│ createdAt   │         │ createdAt    │
└─────────────┘         └──────────────┘
      │
      │ 1:N
      ▼
┌─────────────┐
│  OrderItem  │
├─────────────┤
│ id          │
│ orderId     │
│ menuItemId  │
│ quantity    │
│ price       │
└─────────────┘

┌─────────────┐
│PaymentMethod│
├─────────────┤
│ id          │
│ userId      │
│ cardNumber  │
│ cardHolder  │
│ expiryDate  │
│ isDefault   │
│ createdAt   │
└─────────────┘
```

## Security Considerations

### 1. Authentication
- JWT tokens with 7-day expiry
- Tokens stored in localStorage (client-side)
- Tokens sent in Authorization header
- Server validates token on every request

### 2. Password Security
- Passwords hashed with bcrypt (10 rounds)
- Never stored in plain text
- Never returned in API responses

### 3. Authorization
- Role-based checks in service layer
- Country-based filtering in queries
- Guards prevent unauthorized access

### 4. Input Validation
- Card number: Must be 16 digits
- Expiry date: Must be valid format (MM/YY) and future date
- GraphQL schema validation for all inputs

### 5. SQL Injection Prevention
- Prisma ORM parameterizes all queries
- No raw SQL queries used

## Performance Optimizations

### 1. Database
- Indexed foreign keys
- Pagination on large datasets (ITEMS_PER_PAGE)
- Efficient queries with Prisma includes

### 2. Frontend
- Apollo Client caching
- Network-only fetch policy for fresh data
- Optimistic UI updates
- Code splitting with Next.js

### 3. Backend
- Connection pooling with Prisma
- Efficient GraphQL resolvers
- Minimal data fetching

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (JWT tokens)
- Can run multiple backend instances
- Load balancer can distribute requests

### Database Scaling
- Read replicas for read-heavy operations
- Connection pooling
- Query optimization

### Caching Strategy
- Apollo Client cache on frontend
- Can add Redis for backend caching
- CDN for static assets

## Error Handling

### Backend
- Standardized error messages (ERROR_MESSAGES constants)
- Proper HTTP status codes
- GraphQL error responses

### Frontend
- Toast notifications for user feedback
- Error boundaries for React components
- Graceful degradation

## Testing Strategy

### Unit Tests
- Service layer business logic
- Utility functions
- Component logic

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- User workflows
- Role-based access
- Order creation and checkout

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Setup                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Vercel/Netlify)                              │
│  ├── Static assets on CDN                               │
│  ├── SSR on edge functions                              │
│  └── Environment variables                              │
│                                                          │
│  Backend (AWS/Heroku/DigitalOcean)                      │
│  ├── Docker container                                   │
│  ├── Auto-scaling                                       │
│  ├── Health checks                                      │
│  └── Environment variables                              │
│                                                          │
│  Database (AWS RDS/Heroku Postgres)                     │
│  ├── Automated backups                                  │
│  ├── Read replicas                                      │
│  └── Connection pooling                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```