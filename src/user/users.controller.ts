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
import { ApiParam, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  public getAllUsers(): Promise<UserDto[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'integer',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
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
  @ApiResponse({ status: 400, description: 'Bad request' })
  public registerUser(@Body() user: UserCreationDto): Promise<UserDto> {
    return this.usersService.registerUser(user);
  }

  @Delete(':id')
  public deleteUser(@Param() param: IdParameter): Promise<UserDto> {
    return this.usersService.deleteUser(param.id);
  }
}
