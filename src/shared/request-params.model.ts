import { IsNumberString } from 'class-validator';
import { ApiParam } from '@nestjs/swagger';

export class IdParameter {
  @IsNumberString()
  id: number;
}
