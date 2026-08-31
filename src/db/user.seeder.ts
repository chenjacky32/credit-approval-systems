import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { users } from "./schema.js";

dotenv.config();

const runSeeder = async () => {
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD ? `:${process.env.DB_PASSWORD}` : "";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "3306";
  const database = process.env.DB_NAME || "credit_approval_db";

  const url = `mysql://${user}${password}@${host}:${port}/${database}`;

  console.log("Connecting to database for seeding...");
  const connection = await mysql.createConnection({ uri: url });
  const db = drizzle(connection);

  console.log("Hashing passwords...");
  const saltRounds = 10;
  // Default password: password123 for both
  const hashedPassword = await bcrypt.hash("password123", saltRounds);

  console.log("Inserting users...");
  
  try {
    await db.insert(users).values([
      {
        fullname: "Admin Approval",
        email: "admin@credit.com",
        password: hashedPassword,
        role: "CREDIT_ADMIN",
      },
      {
        fullname: "Analyst Staff",
        email: "analyst@credit.com",
        password: hashedPassword,
        role: "CREDIT_ANALYST",
      },
    ]);
    console.log("Seeding complete! 2 users have been added.");
    console.log("Email 1: admin@credit.com | Password: password123");
    console.log("Email 2: analyst@credit.com | Password: password123");
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log("Users already exist in the database (Duplicate Entry).");
    } else {
      throw error;
    }
  }

  await connection.end();
};

runSeeder().catch((err) => {
  console.error("Seeding failed!", err);
  process.exit(1);
});
