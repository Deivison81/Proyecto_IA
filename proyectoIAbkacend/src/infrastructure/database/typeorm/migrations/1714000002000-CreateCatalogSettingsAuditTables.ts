import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCatalogSettingsAuditTables1714000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'catalog_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'category',
            type: 'varchar',
            length: '30',
          },
          {
            name: 'value',
            type: 'varchar',
            length: '140',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        uniques: [
          {
            name: 'UQ_catalog_items_category_value',
            columnNames: ['category', 'value'],
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'platform_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'key',
            type: 'varchar',
            length: '80',
            isUnique: true,
          },
          {
            name: 'value',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'updated_by_user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'platform_settings',
      new TableForeignKey({
        columnNames: ['updated_by_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'action',
            type: 'varchar',
            length: '140',
          },
          {
            name: 'actor_user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'actor_name',
            type: 'varchar',
            length: '140',
          },
          {
            name: 'context',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'audit_logs',
      new TableForeignKey({
        columnNames: ['actor_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.query(`
      INSERT INTO catalog_items (category, value, is_active)
      VALUES
      ('service', 'Soporte TI general', true),
      ('service', 'Manejo de servidores', true),
      ('service', 'Soporte al desarrollo', true),
      ('service', 'Instalacion y soporte de redes', true),
      ('service', 'Instalacion de camaras', true),
      ('priority', 'Alta', true),
      ('priority', 'Media', true),
      ('priority', 'Baja', true),
      ('status', 'Nuevo', true),
      ('status', 'Disponible', true),
      ('status', 'Asignado', true),
      ('status', 'En revision', true),
      ('status', 'En proceso', true),
      ('status', 'Resuelto', true)
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO platform_settings (key, value)
      VALUES
      ('maintenanceMode', 'false'),
      ('allowClientRegistration', 'true'),
      ('slaHours', '8')
      ON CONFLICT (key) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_logs', true);
    await queryRunner.dropTable('platform_settings', true);
    await queryRunner.dropTable('catalog_items', true);
  }
}
