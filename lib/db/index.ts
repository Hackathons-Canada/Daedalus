import process from "node:process";
import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "./schema";

const sqlite = new Database("./lib/db/sqlite.db");
export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, {
  // to use query builders like findMany()
  schema,
});

// this is important to bring the schema into the database, otherwise the tables won't be created
migrate(db, { migrationsFolder: "drizzle" });
