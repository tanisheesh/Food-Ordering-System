import { ObjectType, Field, ID, Float, Int, registerEnumType } from '@nestjs/graphql';
import { MenuItem } from './restaurant.model';
import { User } from './user.model';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  restaurantId: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @Field()
  createdAt: Date;
}

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field()
  menuItemId: string;

  @Field(() => MenuItem)
  menuItem: MenuItem;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}
