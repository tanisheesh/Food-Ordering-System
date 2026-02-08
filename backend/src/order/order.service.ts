import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

const ITEMS_PER_PAGE = 20;
const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  RESTAURANT_NOT_FOUND: 'Restaurant not found',
  ACCESS_DENIED: 'Access denied to this restaurant',
  MEMBER_CANNOT_CHECKOUT: 'Members do not have permission to checkout orders',
  MEMBER_CANNOT_CANCEL: 'Members do not have permission to cancel orders',
  INVALID_ORDER_STATUS: 'Only pending orders can be checked out',
};

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getUserOrders(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    let whereClause: any = {};
    
    if (user.role === Role.ADMIN) {
      whereClause = {};
    } else if (user.role === Role.MANAGER) {
      const usersInCountry = await this.prisma.user.findMany({
        where: { country: user.country },
        select: { id: true },
      });
      whereClause = {
        userId: { in: usersInCountry.map(u => u.id) },
      };
    } else {
      whereClause = { userId };
    }
    
    return this.prisma.order.findMany({
      where: whereClause,
      include: { 
        orderItems: { include: { menuItem: true } },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: ITEMS_PER_PAGE,
    });
  }

  async createOrder(userId: string, restaurantId: string, items: any[]) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
    
    if (!restaurant) {
      throw new Error(ERROR_MESSAGES.RESTAURANT_NOT_FOUND);
    }
    
    if (user.role !== Role.ADMIN && restaurant.country !== user.country) {
      throw new Error(ERROR_MESSAGES.ACCESS_DENIED);
    }

    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: items.map(i => i.menuItemId) } },
    });

    const totalAmount = items.reduce((sum, item) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      return sum + (menuItem.price * item.quantity);
    }, 0);

    return this.prisma.order.create({
      data: {
        userId,
        restaurantId,
        totalAmount,
        status: 'PENDING',
        orderItems: {
          create: items.map(item => {
            const menuItem = menuItems.find(m => m.id === item.menuItemId);
            return {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: menuItem.price,
            };
          }),
        },
      },
      include: { orderItems: { include: { menuItem: true } }, user: true },
    });
  }

  async checkoutOrder(orderId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    if (user.role === Role.MEMBER) {
      throw new Error(ERROR_MESSAGES.MEMBER_CANNOT_CHECKOUT);
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    
    if (order.status !== 'PENDING') {
      throw new Error(ERROR_MESSAGES.INVALID_ORDER_STATUS);
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
      include: { orderItems: { include: { menuItem: true } }, user: true },
    });
  }

  async cancelOrder(orderId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    if (user.role === Role.MEMBER) {
      throw new Error(ERROR_MESSAGES.MEMBER_CANNOT_CANCEL);
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { orderItems: { include: { menuItem: true } }, user: true },
    });
  }
}
