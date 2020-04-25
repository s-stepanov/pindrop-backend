import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDto, UserCreationDto } from './models/user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return this.usersRepository.find({ select: ['email', 'id'] });
  }

  async getUserById(userId: number): Promise<UserDto> {
    return this.usersRepository.findOne(userId, { select: ['email', 'id'] });
  }

  async registerUser(user: UserCreationDto): Promise<UserDto> {
    const newUser = this.usersRepository.create(user);

    const saved = await this.usersRepository.save(newUser);
    return {
      id: saved.id,
      email: saved.email,
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
