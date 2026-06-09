import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
import { RiskModule } from './risk/risk.module';
import { DisastersModule } from './disasters/disasters.module';
import { TipsModule } from './tips/tips.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WeatherModule,
    RiskModule,
    DisastersModule,
    TipsModule,
  ],
})
export class AppModule {}
