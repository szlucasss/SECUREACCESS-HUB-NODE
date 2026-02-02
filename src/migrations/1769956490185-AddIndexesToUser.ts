import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexesToUser1769956490185 implements MigrationInterface {
    name = 'AddIndexesToUser1769956490185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_7c4efc5ecbdbcb378b7a43fa01" ON "users" ("keycloakId") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c4efc5ecbdbcb378b7a43fa01"`);
    }

}
