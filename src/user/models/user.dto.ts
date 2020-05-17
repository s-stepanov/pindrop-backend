import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName} exactly`;
        },
      },
    });
  };
}

export class UserDto {
  id: string;
  email: string;
  nickname: string;
  accountActive: boolean;
}

export class UserCreationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(6)
  password: string;

  @IsNotEmpty()
  @Length(4)
  nickname: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  passwordConfirmation: string;
}
