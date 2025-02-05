import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateProductInterface } from 'src/products/interface/create-product.interface';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UpdateProductInterface } from './interface/update-product.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: {
        categorie: true,
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ id });
  }

  async create(body: CreateProductDto): Promise<CreateProductInterface> {
    const { categorieId } = body;

    const categorie = await this.categoriesService.findOne(categorieId);

    if (!categorie) throw new HttpException("Categorie doesn't exists", 409);

    // Verify product already exists
    const allProducts: Product[] = await this.findAll();

    const existProduct: boolean = allProducts.some(
      (product) => product.name == body.name,
    );

    if (existProduct) throw new HttpException('Product already exists', 409);

    const product: Product = this.productsRepository.create({
      name: body.name,
      price: body.price,
      quantityStock: body.quantityStock,
      categorie,
    });

    this.productsRepository.save(product);

    return { ...product, categorie: product.categorie.id };
  }

  async update(
    id: number,
    body: UpdateProductDto,
  ): Promise<UpdateProductInterface> {
    const product: Product = await this.productsRepository.preload({
      id,
      ...body,
    });

    if (!product) throw new HttpException("Product doesn't exists", 404);

    this.productsRepository.save(product);

    return { ...product, categorie: product.categorie.id };
  }

  async remove(id: number): Promise<Product> {
    const product: Product = await this.findOne(id);

    if (!product) throw new HttpException("Product doesn't exists", 404);

    return this.productsRepository.remove(product);
  }
}
