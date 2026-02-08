# GraphQL API Collection

Complete API documentation for the Food Ordering System.

## Base URL

```
http://localhost:4000/graphql
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Authentication APIs

### 1. Login

**Type:** Mutation  
**Authentication:** Not required

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

**Variables:**
```json
{
  "email": "nick.fury@slooze.xyz",
  "password": "password"
}
```

**Response:**
```json
{
  "data": {
    "login": {
      "id": "uuid-here",
      "email": "nick.fury@slooze.xyz",
      "name": "Nick Fury",
      "role": "ADMIN",
      "country": null,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

## Restaurant APIs

### 2. Get All Restaurants

**Type:** Query  
**Authentication:** Required  
**Access:** 
- Admin: All restaurants
- Manager/Member: Country-specific restaurants

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

**Response:**
```json
{
  "data": {
    "restaurants": [
      {
        "id": "restaurant-uuid-1",
        "name": "Taj Mahal Restaurant",
        "description": "Authentic Indian cuisine",
        "country": "INDIA",
        "menuItems": [
          {
            "id": "menu-uuid-1",
            "name": "Butter Chicken",
            "description": "Creamy tomato-based curry",
            "price": 12.99
          }
        ]
      }
    ]
  }
}
```

### 3. Get Single Restaurant

**Type:** Query  
**Authentication:** Required

```graphql
query GetRestaurant($id: String!) {
  restaurant(id: $id) {
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

**Variables:**
```json
{
  "id": "restaurant-uuid-1"
}
```

### 4. Get Menu Items

**Type:** Query  
**Authentication:** Not required

```graphql
query GetMenuItems($restaurantId: String!) {
  menuItems(restaurantId: $restaurantId) {
    id
    name
    description
    price
  }
}
```

**Variables:**
```json
{
  "restaurantId": "restaurant-uuid-1"
}
```

---

## Order APIs

### 5. Get My Orders

**Type:** Query  
**Authentication:** Required  
**Access:**
- Admin: All orders globally
- Manager: Orders from their country
- Member: Only their own orders

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

**Response:**
```json
{
  "data": {
    "myOrders": [
      {
        "id": "order-uuid-1",
        "status": "PENDING",
        "totalAmount": 45.97,
        "createdAt": "2026-02-08T18:30:00.000Z",
        "user": {
          "id": "user-uuid-1",
          "name": "Thor",
          "role": "MEMBER"
        },
        "orderItems": [
          {
            "id": "orderitem-uuid-1",
            "quantity": 2,
            "price": 12.99,
            "menuItem": {
              "id": "menu-uuid-1",
              "name": "Butter Chicken"
            }
          }
        ]
      }
    ]
  }
}
```

### 6. Create Order

**Type:** Mutation  
**Authentication:** Required  
**Access:** All authenticated users

```graphql
mutation CreateOrder($restaurantId: String!, $items: [OrderItemInput!]!) {
  createOrder(restaurantId: $restaurantId, items: $items) {
    id
    status
    totalAmount
    createdAt
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

**Variables:**
```json
{
  "restaurantId": "restaurant-uuid-1",
  "items": [
    {
      "menuItemId": "menu-uuid-1",
      "quantity": 2
    },
    {
      "menuItemId": "menu-uuid-2",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "data": {
    "createOrder": {
      "id": "order-uuid-new",
      "status": "PENDING",
      "totalAmount": 45.97,
      "createdAt": "2026-02-08T18:30:00.000Z",
      "orderItems": [
        {
          "id": "orderitem-uuid-1",
          "quantity": 2,
          "price": 12.99,
          "menuItem": {
            "id": "menu-uuid-1",
            "name": "Butter Chicken"
          }
        }
      ]
    }
  }
}
```

### 7. Checkout Order

**Type:** Mutation  
**Authentication:** Required  
**Access:** Admin and Manager only

```graphql
mutation CheckoutOrder($orderId: String!) {
  checkoutOrder(orderId: $orderId) {
    id
    status
    totalAmount
  }
}
```

**Variables:**
```json
{
  "orderId": "order-uuid-1"
}
```

**Response:**
```json
{
  "data": {
    "checkoutOrder": {
      "id": "order-uuid-1",
      "status": "CONFIRMED",
      "totalAmount": 45.97
    }
  }
}
```

**Error Response (Member trying to checkout):**
```json
{
  "errors": [
    {
      "message": "Members do not have permission to checkout orders"
    }
  ]
}
```

### 8. Cancel Order

**Type:** Mutation  
**Authentication:** Required  
**Access:** Admin and Manager only

```graphql
mutation CancelOrder($orderId: String!) {
  cancelOrder(orderId: $orderId) {
    id
    status
  }
}
```

**Variables:**
```json
{
  "orderId": "order-uuid-1"
}
```

**Response:**
```json
{
  "data": {
    "cancelOrder": {
      "id": "order-uuid-1",
      "status": "CANCELLED"
    }
  }
}
```

---

## Payment APIs

### 9. Get Payment Methods

**Type:** Query  
**Authentication:** Required  
**Access:** All authenticated users (read-only for non-admins)

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

**Response:**
```json
{
  "data": {
    "myPaymentMethods": [
      {
        "id": "payment-uuid-1",
        "cardNumber": "4532123456789012",
        "cardHolder": "Nick Fury",
        "expiryDate": "12/28",
        "isDefault": true
      }
    ]
  }
}
```

### 10. Add Payment Method

**Type:** Mutation  
**Authentication:** Required  
**Access:** Admin only

```graphql
mutation AddPaymentMethod($cardNumber: String!, $cardHolder: String!, $expiryDate: String!) {
  addPaymentMethod(cardNumber: $cardNumber, cardHolder: $cardHolder, expiryDate: $expiryDate) {
    id
    cardNumber
    cardHolder
    expiryDate
  }
}
```

**Variables:**
```json
{
  "cardNumber": "4532123456789012",
  "cardHolder": "Nick Fury",
  "expiryDate": "12/28"
}
```

**Validation Rules:**
- Card number must be exactly 16 digits
- Expiry date format: MM/YY
- Expiry date must be in the future
- Month must be between 01-12

**Response:**
```json
{
  "data": {
    "addPaymentMethod": {
      "id": "payment-uuid-new",
      "cardNumber": "4532123456789012",
      "cardHolder": "Nick Fury",
      "expiryDate": "12/28"
    }
  }
}
```

**Error Response (Invalid card number):**
```json
{
  "errors": [
    {
      "message": "Card number must be exactly 16 digits"
    }
  ]
}
```

**Error Response (Non-admin trying to add):**
```json
{
  "errors": [
    {
      "message": "Only administrators can add payment methods"
    }
  ]
}
```

### 11. Update Payment Method

**Type:** Mutation  
**Authentication:** Required  
**Access:** Admin only

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

**Variables:**
```json
{
  "id": "payment-uuid-1",
  "cardHolder": "Nicholas Fury",
  "expiryDate": "06/29"
}
```

**Response:**
```json
{
  "data": {
    "updatePaymentMethod": {
      "id": "payment-uuid-1",
      "cardNumber": "4532123456789012",
      "cardHolder": "Nicholas Fury",
      "expiryDate": "06/29"
    }
  }
}
```

### 12. Delete Payment Method

**Type:** Mutation  
**Authentication:** Required  
**Access:** Admin only

```graphql
mutation DeletePaymentMethod($id: String!) {
  deletePaymentMethod(id: $id)
}
```

**Variables:**
```json
{
  "id": "payment-uuid-1"
}
```

**Response:**
```json
{
  "data": {
    "deletePaymentMethod": true
  }
}
```

## Error Codes

### Authentication Errors
- `No authorization token provided` - Missing JWT token
- `Invalid token` - Expired or malformed token
- `Invalid credentials` - Wrong email/password

### Authorization Errors
- `Members do not have permission to checkout orders`
- `Members do not have permission to cancel orders`
- `Only administrators can add payment methods`
- `Only administrators can modify payment methods`
- `Only administrators can delete payment methods`

### Validation Errors
- `User not found`
- `Restaurant not found`
- `Access denied to this restaurant` - Country mismatch
- `Card number must be exactly 16 digits`
- `Invalid expiry date format or date is in the past`
- `Only pending orders can be checked out`

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { id name role token } }",
    "variables": {
      "email": "nick.fury@slooze.xyz",
      "password": "password"
    }
  }'
```

### Get Restaurants Example
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetRestaurants { restaurants { id name country } }"
  }'
```

## Testing with Postman

1. Create a new POST request to `http://localhost:4000/graphql`
2. Set Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_JWT_TOKEN` (for protected routes)
3. In Body (raw JSON), add:
```json
{
  "query": "your GraphQL query here",
  "variables": {
    "key": "value"
  }
}
```
## GraphQL Playground

Access the interactive GraphQL playground at:
```
http://localhost:4000/graphql
```

Features:
- Auto-completion
- Schema documentation
- Query history
- Variable editor