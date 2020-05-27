import { Injectable } from '@nestjs/common';
import { Repository, getConnection } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDto, UserCreationDto } from './models/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { UserRoles } from './enums/user-roles.enum';
import { UserExistsError } from './errors/user-exists.error';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UserPendingActivation } from './entities/user-pending-activation.entity';
import { InvalidActivationHash } from './errors/invalid-activation-hash.error';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserPendingActivation)
    private pendingActivationRepository: Repository<UserPendingActivation>,

    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return this.usersRepository.find({ select: ['email', 'id', 'nickname', 'accountActive'] });
  }

  async getUserById(userId: number): Promise<UserDto> {
    return this.usersRepository.findOne(userId, {
      select: ['email', 'id', 'nickname'],
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['email', 'id', 'nickname', 'password', 'accountActive'],
      relations: ['userRole'],
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
    newUser.password = await bcrypt.hash(user.password, 12);
    const defaultUserRole = await this.userRoleRepository.findOne({
      where: {
        name: UserRoles.USER,
      },
    });
    newUser.userRole = [defaultUserRole];

    const saved = await this.usersRepository.save(newUser);

    const activationLinkHash = await (await bcrypt.hash(user.nickname + Date.now(), 8)).replace('/', '');
    const activationLinkToSave = this.pendingActivationRepository.create({
      activationHash: activationLinkHash,
    });
    activationLinkToSave.user = saved;

    // TODO: make transactional
    await this.pendingActivationRepository.save(activationLinkToSave);

    await this.sendAccountConfirmationEmail(
      saved,
      `${this.configService.get('ACCOUNT_ACTIVATION_URL')}/${activationLinkHash}`,
    );

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

  async sendAccountConfirmationEmail(user: User, activationLink: string) {
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Pindrop account confirmation ✔',
      template: 'email-template',
      context: {
        nickname: user.nickname,
        activationLink: activationLink,
      },
    });
  }

  async activateAccount(activationHash: string) {
    const existingHash = await this.pendingActivationRepository.findOne({
      where: {
        activationHash,
      },
    });

    if (!existingHash) {
      throw new InvalidActivationHash('invalid activation hash');
    }

    existingHash.user.accountActive = true;
    await getConnection().transaction(async transactionalEntityManager => {
      transactionalEntityManager.save(existingHash.user);
      transactionalEntityManager.remove(existingHash);
    });
  }
}
