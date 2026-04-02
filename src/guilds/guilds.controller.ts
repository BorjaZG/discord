import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { GuildsService } from './guilds.service';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('guilds')
export class GuildsController {
  constructor(private readonly guildsService: GuildsService) {}

  @Post()
  create(@Body() dto: CreateGuildDto, @CurrentUser() user: AuthUser) {
    return this.guildsService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.guildsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.guildsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGuildDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.guildsService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.guildsService.remove(id, user.id);
  }

  @Post(':id/members/:userId')
  addMember(
    @Param('id', ParseUUIDPipe) guildId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.guildsService.addMember(guildId, userId);
  }

  @Delete(':id/members/:userId')
  removeMember(
    @Param('id', ParseUUIDPipe) guildId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.guildsService.removeMember(guildId, userId);
  }
}
