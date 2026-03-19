import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import { GuildsService } from './guilds.service';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';

// Temporary: will be replaced with real JWT user in auth branch
interface RequestWithUser {
  user?: { id: string };
}

@Controller('guilds')
export class GuildsController {
  constructor(private readonly guildsService: GuildsService) {}

  @Post()
  create(@Body() dto: CreateGuildDto, @Request() req: RequestWithUser) {
    // Placeholder ownerId until JWT is wired
    const ownerId = req.user?.id ?? 'placeholder-owner-id';
    return this.guildsService.create(dto, ownerId);
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
    @Request() req: RequestWithUser,
  ) {
    const requesterId = req.user?.id ?? 'placeholder-owner-id';
    return this.guildsService.update(id, dto, requesterId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: RequestWithUser) {
    const requesterId = req.user?.id ?? 'placeholder-owner-id';
    return this.guildsService.remove(id, requesterId);
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
