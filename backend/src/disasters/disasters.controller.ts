import { Controller, Get, Query } from '@nestjs/common';
import { DisastersService } from './disasters.service';

@Controller('disasters')
export class DisastersController {
  constructor(private readonly disastersService: DisastersService) {}

  @Get('fema')
  getFema(@Query('state') state?: string) {
    return this.disastersService.getFemaDeclarations(state);
  }

  @Get('earthquakes')
  getEarthquakes(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
    @Query('radius') radius?: string,
  ) {
    return this.disastersService.getEarthquakes(
      lat ? parseFloat(lat) : undefined,
      lon ? parseFloat(lon) : undefined,
      radius ? parseFloat(radius) : 500,
    );
  }

  @Get('alerts')
  getAlerts(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
  ) {
    return this.disastersService.getNwsAlerts(parseFloat(lat), parseFloat(lon));
  }

  @Get('geocode')
  geocode(@Query('q') query: string) {
    return this.disastersService.geocode(query);
  }
}
