import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categorie } from './entities/categorie.entity';
import { Repository } from 'typeorm';
import { CreateCategorieDto } from './dtos/create-categorie.dto';
import { UpdateCategorieDto } from './dtos/update-categorie.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categorie)
    private readonly categorieRepository: Repository<Categorie>,
  ) {}

  async findAll(): Promise<Categorie[]> {
    return this.categorieRepository.find();
  }

  async findOne(id: number): Promise<Categorie> {
    return this.categorieRepository.findOneBy({ id });
  }

  async create(body: CreateCategorieDto): Promise<CreateCategorieDto> {
    // Verify if categorie already exists
    const allCategories: Categorie[] = await this.findAll();

    const existsCategorie: boolean = allCategories.some(
      (categorie) => body.name == categorie.name,
    );

    if (existsCategorie)
      throw new HttpException('Categorie already exists', HttpStatus.CONFLICT);

    const categorie: Categorie = this.categorieRepository.create({
      name: body.name,
    });

    this.categorieRepository.save(categorie);

    return categorie;
  }

  async update(
    id: number,
    body: UpdateCategorieDto,
  ): Promise<UpdateCategorieDto> {
    const categorie: Categorie = await this.categorieRepository.preload({
      id,
      ...body,
    });

    if (!categorie) throw new HttpException("Categorie doesn't exists", 404);

    this.categorieRepository.save(categorie);

    return categorie;
  }

  async remove(id: number): Promise<Categorie> {
    const categorie: Categorie = await this.findOne(id);

    if (!categorie) throw new HttpException("Categorie doesn't exists", 404);

    return this.categorieRepository.remove(categorie);
  }
}
