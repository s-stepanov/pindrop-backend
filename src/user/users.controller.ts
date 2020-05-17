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
  BadRequestException,
  Res,
} from '@nestjs/common';
import { IdParameter } from 'src/shared/request-params.model';
import { UserCreationDto, UserDto } from './models/user.dto';
import { UsersService } from './users.service';
import { ApiParam, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserExistsError } from './errors/user-exists.error';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

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
  public async registerUser(@Body() user: UserCreationDto): Promise<UserDto> {
    try {
      const registered = await this.usersService.registerUser(user);
      return registered;
    } catch (error) {
      if (error instanceof UserExistsError) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  public deleteUser(@Param() param: IdParameter): Promise<UserDto> {
    return this.usersService.deleteUser(param.id);
  }

  @Get('activate-account/:activationHash')
  public async activateAccount(
    @Param('activationHash') activationHash: string,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.activateAccount(activationHash);
    } catch (e) {
      throw e;
    }

    return res.render('account-activated-template', {
      frontend_url: this.configService.get('FRONTEND_URL'),
    });
  }
}
