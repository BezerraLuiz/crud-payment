import { PartialType } from '@nestjs/mapped-types';
import { CreateCategorieDto } from 'src/categories/dtos/create-categorie.dto';

export class UpdateProductDto extends PartialType(CreateCategorieDto) {}
