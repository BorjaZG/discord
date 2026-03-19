import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGuildDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
