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

  async findMany(params: {
    page: number;
    size: number;
    search?: string;
    status?: "SUBMIT" | "APPROVE" | "REJECT";
    userId?: number;
  }): Promise<{ data: Submission[]; total: number }> {
    const { page, size, search, status, userId } = params;
    const offset = (page - 1) * size;

    const conditions = [];

    if (search) {
      conditions.push(like(submissions.fullname, `%${search}%`));
    }

    if (status) {
      conditions.push(eq(submissions.status, status));
    }

    if (userId) {
      conditions.push(eq(submissions.userId, userId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(submissions)
      .where(whereClause);

    const total = Number(countResult?.count || 0);

    const data = await db
      .select()
      .from(submissions)
      .where(whereClause)
      .limit(size)
      .offset(offset)
      .orderBy(sql`${submissions.createdAt} desc`);

    return { data, total };
  }

}

export const submissionRepository = new SubmissionRepository();
