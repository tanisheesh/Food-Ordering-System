import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password', 10);

  // Create users as per problem statement
  const nickFury = await prisma.user.create({
    data: {
      email: 'nick.fury@slooze.xyz',
      password: hashedPassword,
      name: 'Nick Fury',
      role: 'ADMIN',
      country: 'INDIA',
    },
  });

  const captainMarvel = await prisma.user.create({
    data: {
      email: 'captain.marvel@slooze.xyz',
      password: hashedPassword,
      name: 'Captain Marvel',
      role: 'MANAGER',
      country: 'INDIA',
    },
  });

  const captainAmerica = await prisma.user.create({
    data: {
      email: 'captain.america@slooze.xyz',
      password: hashedPassword,
      name: 'Captain America',
      role: 'MANAGER',
      country: 'AMERICA',
    },
  });

  const thanos = await prisma.user.create({
    data: {
      email: 'thanos@slooze.xyz',
      password: hashedPassword,
      name: 'Thanos',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  const thor = await prisma.user.create({
    data: {
      email: 'thor@slooze.xyz',
      password: hashedPassword,
      name: 'Thor',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  const travis = await prisma.user.create({
    data: {
      email: 'travis@slooze.xyz',
      password: hashedPassword,
      name: 'Travis',
      role: 'MEMBER',
      country: 'AMERICA',
    },
  });

  // Create Indian restaurants
  await prisma.restaurant.create({
    data: {
      name: 'Spice Paradise',
      description: 'Authentic North Indian Cuisine',
      country: 'INDIA',
      menuItems: {
        create: [
          { name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken', price: 12.99 },
          { name: 'Chicken Biryani', description: 'Fragrant basmati rice with spiced chicken', price: 14.99 },
          { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 10.99 },
          { name: 'Garlic Naan', description: 'Fresh baked bread with garlic', price: 3.99 },
          { name: 'Dal Makhani', description: 'Black lentils in creamy sauce', price: 9.99 },
          { name: 'Tandoori Chicken', description: 'Clay oven roasted chicken', price: 13.99 },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'Mumbai Street Food',
      description: 'Popular Indian street food favorites',
      country: 'INDIA',
      menuItems: {
        create: [
          { name: 'Pav Bhaji', description: 'Spiced vegetable curry with bread', price: 8.99 },
          { name: 'Vada Pav', description: 'Potato fritter in a bun', price: 4.99 },
          { name: 'Pani Puri', description: 'Crispy shells with tangy water', price: 5.99 },
          { name: 'Samosa', description: 'Fried pastry with spiced filling', price: 3.99 },
          { name: 'Masala Dosa', description: 'Crispy crepe with potato filling', price: 9.99 },
          { name: 'Chole Bhature', description: 'Chickpea curry with fried bread', price: 10.99 },
        ],
      },
    },
  });

  // Create American restaurants
  await prisma.restaurant.create({
    data: {
      name: 'Burger Haven',
      description: 'Classic American burgers and more',
      country: 'AMERICA',
      menuItems: {
        create: [
          { name: 'Classic Cheeseburger', description: 'Beef patty with cheddar cheese', price: 11.99 },
          { name: 'Bacon Burger', description: 'Burger with crispy bacon strips', price: 13.99 },
          { name: 'Veggie Burger', description: 'Plant-based patty with toppings', price: 10.99 },
          { name: 'Buffalo Wings', description: 'Spicy chicken wings', price: 12.99 },
          { name: 'French Fries', description: 'Crispy golden fries', price: 4.99 },
          { name: 'Onion Rings', description: 'Battered and fried onion rings', price: 5.99 },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      name: 'Pizza Palace',
      description: 'New York style pizza',
      country: 'AMERICA',
      menuItems: {
        create: [
          { name: 'Margherita Pizza', description: 'Classic tomato and mozzarella', price: 14.99 },
          { name: 'Pepperoni Pizza', description: 'Loaded with pepperoni', price: 16.99 },
          { name: 'BBQ Chicken Pizza', description: 'BBQ sauce with grilled chicken', price: 17.99 },
          { name: 'Caesar Salad', description: 'Romaine lettuce with Caesar dressing', price: 8.99 },
          { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 5.99 },
          { name: 'Chocolate Brownie', description: 'Warm brownie with ice cream', price: 6.99 },
        ],
      },
    },
  });

  console.log('✅ Database seeded successfully with fresh data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
