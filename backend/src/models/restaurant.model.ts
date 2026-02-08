import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Country } from './user.model';

@ObjectType()
export class Restaurant {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Country)
  country: Country;

  @Field(() => [MenuItem], { nullable: true })
  menuItems?: MenuItem[];
}

@ObjectType()
export class MenuItem {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field()
  restaurantId: string;
}
