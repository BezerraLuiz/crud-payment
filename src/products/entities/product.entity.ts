import { Categorie } from 'src/categories/entities/categorie.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'quantity_stock' })
  quantityStock: number;

  @ManyToOne(() => Categorie, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'categorie_id' })
  categorie: Categorie;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
