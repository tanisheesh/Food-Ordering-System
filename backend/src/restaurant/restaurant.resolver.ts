import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant, MenuItem } from '../models/restaurant.model';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Resolver()
export class RestaurantResolver {
  constructor(private restaurantService: RestaurantService) {}

  @Query(() => [Restaurant])
  @UseGuards(JwtAuthGuard)
  async restaurants(@Context() context: any) {
    const userId = context.req.user.userId;
    return this.restaurantService.getRestaurants(userId);
  }

  @Query(() => Restaurant)
  @UseGuards(JwtAuthGuard)
  async restaurant(@Args('id') id: string, @Context() context: any) {
    const userId = context.req.user.userId;
    return this.restaurantService.getRestaurant(id, userId);
  }

  @Query(() => [MenuItem])
  async menuItems(@Args('restaurantId') restaurantId: string) {
    return this.restaurantService.getMenuItems(restaurantId);
  }
}
