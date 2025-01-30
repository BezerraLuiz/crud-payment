import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    return this.roleRepository.find();
  }

  async findOne() {
    return this.roleRepository.find();
  }

  async create(body: CreateRoleDto): Promise<Role> {
    // Verify role exists

    // Create
    const role: Role = this.roleRepository.create({
      ...body,
    });

    await this.roleRepository.save(role);

    return role;
  }

  async update(id: number, body: UpdateRoleDto) {}
}
