import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IdParameter } from 'src/shared/request-params.model';
import { UserCreationDto, UserDto } from './models/user.dto';
import { UsersService } from './users.service';
import { ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public getAllUsers(): Promise<UserDto[]> {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public deleteUser(@Param() param: IdParameter): Promise<UserDto> {
    return this.usersService.deleteUser(param.id);
  }
}
