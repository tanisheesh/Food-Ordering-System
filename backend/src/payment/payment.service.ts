import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  ADMIN_NOT_FOUND: 'No admin user found in the system',
  ONLY_ADMIN_CAN_ADD: 'Only administrators can add payment methods',
  ONLY_ADMIN_CAN_MODIFY: 'Only administrators can modify payment methods',
  ONLY_ADMIN_CAN_DELETE: 'Only administrators can delete payment methods',
  INVALID_CARD_NUMBER: 'Card number must be exactly 16 digits',
  INVALID_EXPIRY: 'Invalid expiry date format or date is in the past',
};

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async getUserPaymentMethods(userId: string) {
    const adminUser = await this.prisma.user.findFirst({ 
      where: { role: Role.ADMIN },
      orderBy: { createdAt: 'asc' },
    });
    
    if (!adminUser) {
      return [];
    }
    
    return this.prisma.paymentMethod.findMany({ where: { userId: adminUser.id } });
  }

  private validateCardNumber(cardNumber: string): void {
    if (!/^\d{16}$/.test(cardNumber)) {
      throw new Error(ERROR_MESSAGES.INVALID_CARD_NUMBER);
    }
  }

  private validateExpiryDate(expiryDate: string): void {
    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt(`20${year}`);
    
    if (monthNum < 1 || monthNum > 12) {
      throw new Error(ERROR_MESSAGES.INVALID_EXPIRY);
    }
    
    const now = new Date();
    const expiry = new Date(yearNum, monthNum - 1);
    
    if (expiry < now) {
      throw new Error(ERROR_MESSAGES.INVALID_EXPIRY);
    }
  }

  async addPaymentMethod(userId: string, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    if (user.role !== Role.ADMIN) {
      throw new Error(ERROR_MESSAGES.ONLY_ADMIN_CAN_ADD);
    }

    this.validateCardNumber(data.cardNumber);
    this.validateExpiryDate(data.expiryDate);

    return this.prisma.paymentMethod.create({
      data: { ...data, userId },
    });
  }

  async updatePaymentMethod(userId: string, id: string, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    if (user.role !== Role.ADMIN) {
      throw new Error(ERROR_MESSAGES.ONLY_ADMIN_CAN_MODIFY);
    }

    if (data.cardNumber) {
      this.validateCardNumber(data.cardNumber);
    }
    
    if (data.expiryDate) {
      this.validateExpiryDate(data.expiryDate);
    }

    return this.prisma.paymentMethod.update({
      where: { id },
      data,
    });
  }

  async deletePaymentMethod(userId: string, id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    
    if (user.role !== Role.ADMIN) {
      throw new Error(ERROR_MESSAGES.ONLY_ADMIN_CAN_DELETE);
    }

    await this.prisma.paymentMethod.delete({ where: { id } });
  }
}
