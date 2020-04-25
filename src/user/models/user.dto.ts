import { IsEmail, IsNotEmpty, Length, Equals } from 'class-validator';

export class UserDto {
  id: string;
  email: string;
}

export class UserCreationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(6)
  password: string;

  @IsNotEmpty()
  @Equals(this.password)
  passwordConfirmation: string;
}
