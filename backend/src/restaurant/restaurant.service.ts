import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const ITEMS_PER_PAGE = 10;

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async getRestaurants(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const whereClause = user.role === 'ADMIN' ? {} : { country: user.country };
    
    return this.prisma.restaurant.findMany({
      where: whereClause,
      include: { menuItems: true },
      take: ITEMS_PER_PAGE,
    });
  }

  async getRestaurant(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });
    
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    
    if (user.role !== 'ADMIN' && restaurant.country !== user.country) {
      throw new Error('Access denied to this restaurant');
    }
    
    return restaurant;
  }

  async getMenuItems(restaurantId: string) {
    return this.prisma.menuItem.findMany({ where: { restaurantId } });
  }
}
