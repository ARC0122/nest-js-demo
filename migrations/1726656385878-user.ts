import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class User1726656385878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'UserID',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'FName',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'LName',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'Email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'Mobile',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'Gender',
            type: 'enum',
            enum: ['male', 'female', 'other'],
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'createdBy',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedBy',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    await queryRunner.dropForeignKey('users', 'FK_Users_Owner');

    // Drop the 'users' table
    await queryRunner.dropTable('users');
  }
}
