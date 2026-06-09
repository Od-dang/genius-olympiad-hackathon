import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { TIPS_DATA } from './tips.data';

@Controller('tips')
export class TipsController {
  @Get()
  getAll() {
    return TIPS_DATA;
  }

  @Get(':type')
  getByType(@Param('type') type: string) {
    const key = type.toUpperCase();
    const tips = TIPS_DATA[key];
    if (!tips) throw new NotFoundException(`No tips found for disaster type: ${type}`);
    return tips;
  }
}
