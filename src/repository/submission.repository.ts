import { eq, like, sql, and } from "drizzle-orm";
import { db } from "../config/db.js";
import { submissions, Submission, NewSubmission } from "../db/schema.js";

export class SubmissionRepository {
  async create(data: NewSubmission): Promise<number> {
    const [result] = await db.insert(submissions).values(data);
    return result.insertId;
  }

  async countByFullname(fullname: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(eq(submissions.fullname, fullname));
    return Number(result[0]?.count || 0);
  }

  async findById(id: number): Promise<Submission | undefined> {
    const result = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);
    return result[0];
  }

}

export const submissionRepository = new SubmissionRepository();
