import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @IsNotEmpty()
  @IsPositive()
  readonly quantityStock: number;

  @IsNotEmpty()
  @IsNumber()
  readonly categorieId: number;
}
