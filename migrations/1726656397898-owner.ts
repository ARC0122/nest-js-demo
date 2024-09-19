import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Owner1726656397898 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'owners',
        columns: [
          {
            name: 'OwnerID',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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
          {
            name: 'UserID',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Add foreign key for 'UserID' (ManyToOne relation)
    await queryRunner.createForeignKey(
      'owners',
      new TableForeignKey({
        columnNames: ['UserID'],
        referencedColumnNames: ['UserID'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key for 'UserID'
    await queryRunner.dropForeignKey('owners', 'FK_owners_UserID');

    // Drop the 'owners' table
    await queryRunner.dropTable('owners');
  }
}
