import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentMethod } from '../models/payment.model';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Query(() => [PaymentMethod])
  @UseGuards(JwtAuthGuard)
  async myPaymentMethods(@Context() context: any) {
    const userId = context.req.user.userId;
    return this.paymentService.getUserPaymentMethods(userId);
  }

  @Mutation(() => PaymentMethod)
  @UseGuards(JwtAuthGuard)
  async addPaymentMethod(
    @Args('cardNumber') cardNumber: string,
    @Args('cardHolder') cardHolder: string,
    @Args('expiryDate') expiryDate: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.userId;
    return this.paymentService.addPaymentMethod(userId, { cardNumber, cardHolder, expiryDate });
  }

  @Mutation(() => PaymentMethod)
  @UseGuards(JwtAuthGuard)
  async updatePaymentMethod(
    @Args('id') id: string,
    @Args('cardNumber', { nullable: true }) cardNumber: string,
    @Args('cardHolder', { nullable: true }) cardHolder: string,
    @Args('expiryDate', { nullable: true }) expiryDate: string,
    @Context() context: any,
  ) {
    const userId = context.req.user.userId;
    return this.paymentService.updatePaymentMethod(userId, id, { cardNumber, cardHolder, expiryDate });
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deletePaymentMethod(@Args('id') id: string, @Context() context: any) {
    const userId = context.req.user.userId;
    await this.paymentService.deletePaymentMethod(userId, id);
    return true;
  }
}
