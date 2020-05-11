import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDto, UserCreationDto } from './models/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { UserRoles } from './enums/user-roles.enum';
import { UserExistsError } from './errors/user-exists.error';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return this.usersRepository.find({ select: ['email', 'id'] });
  }

  async getUserById(userId: number): Promise<UserDto> {
    return this.usersRepository.findOne(userId, { select: ['email', 'id'] });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async registerUser(user: UserCreationDto): Promise<UserDto> {
    const existingUser = await this.usersRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      throw new UserExistsError(`User with email ${user.email} already exists`);
    }

    const newUser = this.usersRepository.create(user);
    const defaultUserRole = await this.userRoleRepository.findOne({
      where: {
        name: UserRoles.USER,
      },
    });
    newUser.userRole = [defaultUserRole];

    const saved = await this.usersRepository.save(newUser);
    return {
      id: saved.id,
      email: saved.email,
      nickname: saved.nickname,
      accountActive: saved.accountActive,
    };
  }

  async deleteUser(userId: number): Promise<any> {
    const userToRemove = await this.usersRepository.findOne(userId);
    if (!userToRemove) {
      throw new Error(`No user with userId=${userId}`);
    }

    return this.usersRepository.remove(userToRemove);
  }
}
