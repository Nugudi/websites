import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_CONNECTION } from "src/database/database-connection";

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow("DATABASE_URL"),
        });

        return drizzle(pool, {
          schema: {},
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
