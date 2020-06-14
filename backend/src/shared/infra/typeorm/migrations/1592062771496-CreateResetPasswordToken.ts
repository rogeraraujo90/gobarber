import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateResetPasswordToken1592062771496
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const resetPasswordTokenTable = new Table({
      name: 'reset_password_tokens',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'user_id',
          type: 'uuid',
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
      foreignKeys: [
        {
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          name: 'ResetPasswordTokenUser',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      ],
    });

    await queryRunner.createTable(resetPasswordTokenTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reset_password_tokens');
  }
}
