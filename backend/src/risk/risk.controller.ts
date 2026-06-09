import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get()
  async getRisk(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
  ) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum)) {
      throw new BadRequestException('lat and lon query params are required');
    }
    return this.riskService.assess(latNum, lonNum);
  }
}
