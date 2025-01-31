import { HttpException, Injectable } from '@nestjs/common';
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

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    return this.roleRepository.findOne({ where: { id } });
  }

  async create(body: CreateRoleDto): Promise<Role> {
    // Verify role exists
    const allRoles: Role[] = await this.findAll();

    const existRole: boolean = allRoles.some((role) => role.name == body.name);

    if (existRole) throw new HttpException('Role already exists', 409);

    // Create
    const role: Role = this.roleRepository.create({
      ...body,
    });

    await this.roleRepository.save(role);

    return role;
  }

  async update(id: number, body: UpdateRoleDto): Promise<Role> {
    const role: Role = await this.roleRepository.preload({
      id,
      ...body,
    });

    this.roleRepository.save(role);

    return role;
  }

  async remove(id: number): Promise<Role> {
    const role: Role = await this.findOne(id);

    if (!role) throw new HttpException("Role doesn't exists", 404);

    return this.roleRepository.remove(role);
  }
}
