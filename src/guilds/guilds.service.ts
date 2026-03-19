import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuildDto } from './dto/create-guild.dto';
import { UpdateGuildDto } from './dto/update-guild.dto';

@Injectable()
export class GuildsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGuildDto, ownerId: string) {
    const guild = await this.prisma.guild.create({
      data: {
        ...dto,
        ownerId,
        members: { create: { userId: ownerId } },
      },
      include: { owner: { select: { id: true, username: true } }, channels: true },
    });
    return guild;
  }

  async findAll() {
    return this.prisma.guild.findMany({
      include: {
        owner: { select: { id: true, username: true } },
        _count: { select: { members: true, channels: true } },
      },
    });
  }

  async findOne(id: string) {
    const guild = await this.prisma.guild.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, username: true } },
        channels: true,
        members: { include: { user: { select: { id: true, username: true, avatar: true } } } },
      },
    });
    if (!guild) throw new NotFoundException(`Guild ${id} not found`);
    return guild;
  }

  async update(id: string, dto: UpdateGuildDto, requesterId: string) {
    const guild = await this.findOne(id);
    if (guild.ownerId !== requesterId) {
      throw new ForbiddenException('Only the owner can update this guild');
    }
    return this.prisma.guild.update({
      where: { id },
      data: dto,
      include: { owner: { select: { id: true, username: true } } },
    });
  }

  async remove(id: string, requesterId: string) {
    const guild = await this.findOne(id);
    if (guild.ownerId !== requesterId) {
      throw new ForbiddenException('Only the owner can delete this guild');
    }
    await this.prisma.guild.delete({ where: { id } });
    return { message: `Guild ${id} deleted` };
  }

  async addMember(guildId: string, userId: string) {
    await this.findOne(guildId);
    return this.prisma.guildMember.upsert({
      where: { userId_guildId: { userId, guildId } },
      create: { userId, guildId },
      update: {},
    });
  }

  async removeMember(guildId: string, userId: string) {
    await this.findOne(guildId);
    await this.prisma.guildMember.delete({
      where: { userId_guildId: { userId, guildId } },
    });
    return { message: `User ${userId} removed from guild ${guildId}` };
  }
}
