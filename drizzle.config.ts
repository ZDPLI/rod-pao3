import { resolve } from "path";

const dbUrl = process.env.DATABASE_URL || resolve(process.cwd(), "data/rod.db");

export default {
  schema: "./db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbUrl,
  },
};
