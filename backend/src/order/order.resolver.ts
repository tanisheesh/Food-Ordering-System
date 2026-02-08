import { Resolver, Query, Mutation, Args, Context, InputType, Field, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '../models/order.model';
import { JwtAuthGuard } from '../auth/jwt.guard';

@InputType()
class OrderItemInput {
  @Field()
  menuItemId: string;

  @Field(() => Int)
  quantity: number;
}

@Resolver()
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => [Order])
  @UseGuards(JwtAuthGuard)
  async myOrders(@Context() context: any) {
    const userId = context.req.user.userId;
    return this.orderService.getUserOrders(userId);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Args('restaurantId') restaurantId: string,
    @Args('items', { type: () => [OrderItemInput] }) items: OrderItemInput[],
    @Context() context: any,
  ) {
    const userId = context.req.user.userId;
    return this.orderService.createOrder(userId, restaurantId, items);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  async checkoutOrder(@Args('orderId') orderId: string, @Context() context: any) {
    const userId = context.req.user.userId;
    return this.orderService.checkoutOrder(orderId, userId);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Args('orderId') orderId: string, @Context() context: any) {
    const userId = context.req.user.userId;
    return this.orderService.cancelOrder(orderId, userId);
  }
}
