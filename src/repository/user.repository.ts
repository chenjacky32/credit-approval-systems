import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { users, User, NewUser } from "../db/schema.js";

export class UserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async findById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async create(data: NewUser): Promise<number> {
    const [result] = await db.insert(users).values(data);
    return result.insertId;
  }
}

export const userRepository = new UserRepository();
