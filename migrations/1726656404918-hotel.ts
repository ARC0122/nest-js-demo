import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Hotel1726656404918 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'hotels',
        columns: [
          {
            name: 'HotelID',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'hotelName',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'city',
            type: 'varchar',
            length: '255',
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
            name: 'OwnerID',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Add foreign key for 'ownerID' (ManyToOne relation)
    await queryRunner.createForeignKey(
      'hotels',
      new TableForeignKey({
        columnNames: ['OwnerID'],
        referencedColumnNames: ['OwnerID'],
        referencedTableName: 'owners',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key for 'ownerID'
    await queryRunner.dropForeignKey('hotels', 'FK_hotels_ownerID');

    // Drop the 'hotels' table
    await queryRunner.dropTable('hotels');
  }
}
