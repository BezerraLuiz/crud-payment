import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categorie } from './entities/categorie.entity';
import { CreateCategorieDto } from './dtos/create-categorie.dto';
import { UpdateCategorieDto } from './dtos/update-categorie.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('')
  findAll(): Promise<Categorie[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Categorie> {
    return this.categoriesService.findOne(id);
  }

  @Post('')
  create(@Body() body: CreateCategorieDto): Promise<CreateCategorieDto> {
    return this.categoriesService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategorieDto,
  ): Promise<UpdateCategorieDto> {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Categorie> {
    return this.categoriesService.remove(id);
  }
}
