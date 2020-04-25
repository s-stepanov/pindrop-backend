import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { IdParameter } from 'src/shared/request-params.model';
import { UserCreationDto, UserDto } from './models/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  public getAllUsers(): Promise<UserDto[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  public async getUserById(@Param() param: IdParameter): Promise<UserDto> {
    const user = await this.usersService.getUserById(param.id);

    if (!user) {
      throw new HttpException(
        `No user with id=${param.id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  @Post()
  public registerUser(@Body() user: UserCreationDto): Promise<UserDto> {
    return this.usersService.registerUser(user);
  }

  @Delete(':id')
  public deleteUser(@Param() param: IdParameter): Promise<UserDto> {
    return this.usersService.deleteUser(param.id);
  }
}
