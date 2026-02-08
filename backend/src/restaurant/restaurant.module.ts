import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurant.resolver';
import { RestaurantService } from './restaurant.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantModule {}
