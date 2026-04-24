import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTicketsTables1714000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'tickets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '180',
          },
          {
            name: 'service',
            type: 'varchar',
            length: '180',
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '30',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '30',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'evidence',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'diagnosis',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'requester_type',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'client_name',
            type: 'varchar',
            length: '140',
          },
          {
            name: 'created_by_user_id',
            type: 'uuid',
          },
          {
            name: 'assigned_to_user_id',
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

    await queryRunner.createForeignKeys('tickets', [
      new TableForeignKey({
        columnNames: ['created_by_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
      new TableForeignKey({
        columnNames: ['assigned_to_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    ]);

    await queryRunner.createIndices('tickets', [
      new TableIndex({
        name: 'IDX_tickets_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'IDX_tickets_priority',
        columnNames: ['priority'],
      }),
      new TableIndex({
        name: 'IDX_tickets_assigned_to_user_id',
        columnNames: ['assigned_to_user_id'],
      }),
    ]);

    await queryRunner.createTable(
      new Table({
        name: 'ticket_updates',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'ticket_id',
            type: 'uuid',
          },
          {
            name: 'author_name',
            type: 'varchar',
            length: '140',
          },
          {
            name: 'note',
            type: 'text',
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
      'ticket_updates',
      new TableForeignKey({
        columnNames: ['ticket_id'],
        referencedTableName: 'tickets',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'ticket_updates',
      new TableIndex({
        name: 'IDX_ticket_updates_ticket_id',
        columnNames: ['ticket_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ticket_updates', true);
    await queryRunner.dropTable('tickets', true);
  }
}
