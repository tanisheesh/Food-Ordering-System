import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethod {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  cardNumber: string;

  @Field()
  cardHolder: string;

  @Field()
  expiryDate: string;

  @Field()
  isDefault: boolean;

  @Field()
  createdAt: Date;
}
