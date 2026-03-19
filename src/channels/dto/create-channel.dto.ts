import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  guildId: string;
}
