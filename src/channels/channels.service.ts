import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChannelDto) {
    const guildExists = await this.prisma.guild.findUnique({
      where: { id: dto.guildId },
    });
    if (!guildExists) throw new NotFoundException(`Guild ${dto.guildId} not found`);

    return this.prisma.channel.create({
      data: dto,
      include: { guild: { select: { id: true, name: true } } },
    });
  }

  async findAll(guildId?: string) {
    return this.prisma.channel.findMany({
      where: guildId ? { guildId } : undefined,
      include: { guild: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: {
        guild: { select: { id: true, name: true } },
        _count: { select: { messages: true } },
      },
    });
    if (!channel) throw new NotFoundException(`Channel ${id} not found`);
    return channel;
  }

  async update(id: string, dto: UpdateChannelDto) {
    await this.findOne(id);
    return this.prisma.channel.update({
      where: { id },
      data: dto,
      include: { guild: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.channel.delete({ where: { id } });
    return { message: `Channel ${id} deleted` };
  }
}
