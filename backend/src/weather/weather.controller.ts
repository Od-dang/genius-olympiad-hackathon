import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
  ) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum)) {
      throw new BadRequestException('lat and lon query params are required and must be numbers');
    }
    return this.weatherService.getWeather(latNum, lonNum);
  }
}
