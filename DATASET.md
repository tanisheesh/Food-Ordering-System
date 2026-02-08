# Dataset Documentation

This document describes the seed data used in the Food Ordering System for testing and development.

## Overview

The seed script (`backend/prisma/seed.ts`) populates the database with:
- 6 test users (1 Admin, 2 Managers, 3 Members)
- 4 restaurants (2 in India, 2 in America)
- 24 menu items (6 per restaurant)
- 2 payment methods (for Admin user)

---

## Users Dataset

### Admin User

| Field | Value |
|-------|-------|
| Name | Nick Fury |
| Email | nick.fury@slooze.xyz |
| Password | password (hashed) |
| Role | ADMIN |
| Country | null |

**Permissions:**
- Access all restaurants globally
- View all orders globally
- Checkout and cancel any order
- Manage payment methods

---

### Manager Users

#### Manager 1 - India

| Field | Value |
|-------|-------|
| Name | Captain Marvel |
| Email | captain.marvel@slooze.xyz |
| Password | password (hashed) |
| Role | MANAGER |
| Country | INDIA |

**Permissions:**
- Access Indian restaurants only
- View orders from Indian users
- Checkout and cancel orders
- View payment methods (read-only)

#### Manager 2 - America

| Field | Value |
|-------|-------|
| Name | Captain America |
| Email | captain.america@slooze.xyz |
| Password | password (hashed) |
| Role | MANAGER |
| Country | AMERICA |

**Permissions:**
- Access American restaurants only
- View orders from American users
- Checkout and cancel orders
- View payment methods (read-only)

---

### Member Users

#### Member 1 - India

| Field | Value |
|-------|-------|
| Name | Thanos |
| Email | thanos@slooze.xyz |
| Password | password (hashed) |
| Role | MEMBER |
| Country | INDIA |

**Permissions:**
- Access Indian restaurants only
- View own orders only
- Create orders
- View payment methods (read-only)

#### Member 2 - India

| Field | Value |
|-------|-------|
| Name | Thor |
| Email | thor@slooze.xyz |
| Password | password (hashed) |
| Role | MEMBER |
| Country | INDIA |

**Permissions:**
- Access Indian restaurants only
- View own orders only
- Create orders
- View payment methods (read-only)

#### Member 3 - America

| Field | Value |
|-------|-------|
| Name | Travis |
| Email | travis@slooze.xyz |
| Password | password (hashed) |
| Role | MEMBER |
| Country | AMERICA |

**Permissions:**
- Access American restaurants only
- View own orders only
- Create orders
- View payment methods (read-only)

---

## Restaurants Dataset

### Indian Restaurants

#### Restaurant 1: Taj Mahal Restaurant

| Field | Value |
|-------|-------|
| Name | Taj Mahal Restaurant |
| Description | Authentic Indian cuisine with traditional flavors |
| Country | INDIA |

**Menu Items:**

1. **Butter Chicken**
   - Description: Creamy tomato-based curry with tender chicken
   - Price: $12.99

2. **Paneer Tikka**
   - Description: Grilled cottage cheese with Indian spices
   - Price: $10.99

3. **Biryani**
   - Description: Fragrant rice dish with aromatic spices
   - Price: $14.99

4. **Naan Bread**
   - Description: Traditional Indian flatbread
   - Price: $3.99

5. **Samosa**
   - Description: Crispy pastry filled with spiced potatoes
   - Price: $5.99

6. **Mango Lassi**
   - Description: Sweet yogurt drink with mango
   - Price: $4.99

#### Restaurant 2: Spice Garden

| Field | Value |
|-------|-------|
| Name | Spice Garden |
| Description | Modern Indian dining experience |
| Country | INDIA |

**Menu Items:**

1. **Chicken Tikka Masala**
   - Description: Grilled chicken in creamy tomato sauce
   - Price: $13.99

2. **Palak Paneer**
   - Description: Cottage cheese in spinach gravy
   - Price: $11.99

3. **Lamb Rogan Josh**
   - Description: Tender lamb in aromatic curry
   - Price: $16.99

4. **Garlic Naan**
   - Description: Flatbread with garlic and butter
   - Price: $4.49

5. **Vegetable Pakora**
   - Description: Deep-fried vegetable fritters
   - Price: $6.99

6. **Chai Tea**
   - Description: Traditional Indian spiced tea
   - Price: $3.99

---

### American Restaurants

#### Restaurant 3: Burger Haven

| Field | Value |
|-------|-------|
| Name | Burger Haven |
| Description | Classic American burgers and fries |
| Country | AMERICA |

**Menu Items:**

1. **Classic Cheeseburger**
   - Description: Beef patty with cheese, lettuce, and tomato
   - Price: $11.99

2. **Bacon Burger**
   - Description: Burger with crispy bacon strips
   - Price: $13.99

3. **Veggie Burger**
   - Description: Plant-based patty with fresh vegetables
   - Price: $10.99

4. **French Fries**
   - Description: Crispy golden fries
   - Price: $4.99

5. **Onion Rings**
   - Description: Battered and fried onion rings
   - Price: $5.99

6. **Milkshake**
   - Description: Creamy vanilla milkshake
   - Price: $5.49

#### Restaurant 4: Pizza Palace

| Field | Value |
|-------|-------|
| Name | Pizza Palace |
| Description | New York style pizza and Italian favorites |
| Country | AMERICA |

**Menu Items:**

1. **Margherita Pizza**
   - Description: Classic pizza with tomato and mozzarella
   - Price: $14.99

2. **Pepperoni Pizza**
   - Description: Pizza topped with pepperoni slices
   - Price: $16.99

3. **BBQ Chicken Pizza**
   - Description: Pizza with BBQ sauce and grilled chicken
   - Price: $17.99

4. **Caesar Salad**
   - Description: Romaine lettuce with Caesar dressing
   - Price: $8.99

5. **Garlic Bread**
   - Description: Toasted bread with garlic butter
   - Price: $5.99

6. **Tiramisu**
   - Description: Classic Italian dessert
   - Price: $6.99



## Payment Methods Dataset

### Payment Method 1

| Field | Value |
|-------|-------|
| Card Number | 4532123456789012 |
| Card Holder | Nick Fury |
| Expiry Date | 12/28 |
| Is Default | true |
| Owner | Admin (Nick Fury) |

### Payment Method 2

| Field | Value |
|-------|-------|
| Card Number | 5425233430109903 |
| Card Holder | Nick Fury |
| Expiry Date | 06/27 |
| Is Default | false |
| Owner | Admin (Nick Fury) |

**Note:** Payment methods are owned by the Admin user but visible to all users. Only Admin can add, edit, or delete payment methods.


## Data Statistics

### Summary

| Entity | Count |
|--------|-------|
| Users | 6 |
| Restaurants | 4 |
| Menu Items | 24 |
| Payment Methods | 2 |
| Orders | 0 (created by users) |

### Distribution

**Users by Role:**
- Admin: 1
- Manager: 2
- Member: 3

**Users by Country:**
- India: 3 (1 Manager + 2 Members)
- America: 2 (1 Manager + 1 Member)
- Global: 1 (Admin)

**Restaurants by Country:**
- India: 2
- America: 2

**Menu Items by Restaurant:**
- Each restaurant: 6 items

**Price Range:**
- Minimum: $3.99 (Naan Bread, Chai Tea)
- Maximum: $17.99 (BBQ Chicken Pizza)
- Average: ~$9.50


## Seed Script Usage

### Run Seed Script

```bash
cd backend
npx prisma db seed
```

### Reset Database and Reseed

```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

### Seed Script Location

```
backend/prisma/seed.ts
```


## Test Scenarios

### Scenario 1: Admin Access
**User:** Nick Fury (Admin)
**Expected Behavior:**
- Can see all 4 restaurants (2 Indian + 2 American)
- Can create orders from any restaurant
- Can checkout and cancel any order
- Can manage payment methods

### Scenario 2: Indian Manager Access
**User:** Captain Marvel (Manager - India)
**Expected Behavior:**
- Can see only 2 Indian restaurants
- Can create orders from Indian restaurants only
- Can checkout and cancel orders from Indian users
- Cannot modify payment methods

### Scenario 3: American Manager Access
**User:** Captain America (Manager - America)
**Expected Behavior:**
- Can see only 2 American restaurants
- Can create orders from American restaurants only
- Can checkout and cancel orders from American users
- Cannot modify payment methods

### Scenario 4: Indian Member Access
**User:** Thanos or Thor (Member - India)
**Expected Behavior:**
- Can see only 2 Indian restaurants
- Can create orders from Indian restaurants only
- Can view only their own orders
- Cannot checkout or cancel orders
- Cannot modify payment methods

### Scenario 5: American Member Access
**User:** Travis (Member - America)
**Expected Behavior:**
- Can see only 2 American restaurants
- Can create orders from American restaurants only
- Can view only their own orders
- Cannot checkout or cancel orders
- Cannot modify payment methods

## Data Validation Rules

### User Data
- Email must be unique
- Password must be hashed (bcrypt)
- Role must be: ADMIN, MANAGER, or MEMBER
- Country required for Manager and Member
- Country must be null for Admin

### Restaurant Data
- Name must be unique
- Country must be: INDIA or AMERICA
- Must have at least one menu item

### Menu Item Data
- Price must be positive
- Must belong to a restaurant

### Payment Method Data
- Card number must be 16 digits
- Expiry date format: MM/YY
- Expiry date must be in future
- Must belong to a user

### Order Data
- Must have at least one order item
- Total amount must match sum of order items
- Status must be: PENDING, CONFIRMED, or CANCELLED
- User must have access to restaurant (country check)


## Custom Dataset

To create your own dataset, modify `backend/prisma/seed.ts`:

1. Add more users with different roles/countries
2. Add more restaurants with different cuisines
3. Add more menu items with varied prices
4. Add more payment methods

Then run:
```bash
npx prisma db seed
```

## Data Privacy

**Important:** This is test data for development only.

- All passwords are the same: `password`
- Card numbers are fake (not real credit cards)
- Email addresses use test domain: `slooze.xyz`
- Do not use this data in production
- Replace with real data validation in production
