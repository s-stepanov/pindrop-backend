import { IsNumberString } from 'class-validator';

export class IdParameter {
  @IsNumberString()
  id: number;
}
