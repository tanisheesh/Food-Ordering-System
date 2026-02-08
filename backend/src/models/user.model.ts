import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export enum Country {
  INDIA = 'INDIA',
  AMERICA = 'AMERICA',
}

registerEnumType(Role, {
  name: 'Role',
});

registerEnumType(Country, {
  name: 'Country',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Country, { nullable: true })
  country?: Country;

  @Field()
  createdAt: Date;
  
  @Field({ nullable: true })
  token?: string;
}
