import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './create-channel.dto';

// guildId cannot be changed after creation
export class UpdateChannelDto extends PartialType(
  OmitType(CreateChannelDto, ['guildId'] as const),
) {}
