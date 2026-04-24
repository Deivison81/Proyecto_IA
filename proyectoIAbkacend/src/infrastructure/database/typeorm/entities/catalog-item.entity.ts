import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export const CATALOG_CATEGORIES = ['service', 'priority', 'status'] as const;
export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];

@Entity('catalog_items')
@Unique(['category', 'value'])
export class CatalogItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 30 })
  category!: CatalogCategory;

  @Column({ type: 'varchar', length: 140 })
  value!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
