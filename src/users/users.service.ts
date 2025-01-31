import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async create(body: CreateUserDto): Promise<User> {
    // Verify mail in use
    const allUsers: User[] = await this.findAll();

    const existUser: boolean = allUsers.some((user) => user.mail == body.mail);

    if (existUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    // Create user
    const user: User = this.userRepository.create({
      ...body,
      passwordHash: body.password,
    });

    await this.userRepository.save(user);

    return user;
  }

  async update(id: number, body: UpdateUserDto): Promise<User> {
    const mail: string = body.mail ?? body.mail;

    if (mail) throw new HttpException("Mail can't be updated", 409);

    const user: User = await this.userRepository.preload({
      id,
      ...body,
      passwordHash: body.password,
    });

    if (!user) throw new HttpException("User doesn't exist", 404);

    this.userRepository.save(user);

    return user;
  }

  async remove(id: number): Promise<User> {
    const user: User = await this.findOne(id);

    if (!user) throw new HttpException("User doesn't exists", 404);

    return this.userRepository.remove(user);
  }
}
