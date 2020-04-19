import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAppointment1587225155793
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const appointmentsTable = new Table({
      name: 'appointments',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'provider',
          type: 'varchar',
        },
        {
          name: 'date',
          type: 'timestamp with time zone',
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
    });

    await queryRunner.createTable(appointmentsTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('appointments');
  }
}
