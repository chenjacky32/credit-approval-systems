import {
  submissionRepository,
  SubmissionRepository,
} from "../repository/submission.repository.js";
import {
  CreateSubmissionDTO,
  QuerySubmissionListDTO,
} from "../dto/submission.dto.js";
import { HttpError } from "../utils/custom-error.js";
import { Submission } from "../db/schema.js";

export class SubmissionService {
  constructor(
    private submissionRepo: SubmissionRepository = submissionRepository
  ) {}

  private calculateMonthlyBilling(amount: number | string, tenor: number): number {
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return Math.round(numericAmount / tenor);
  }
  
  async createSubmission(adminUserId: number, data: CreateSubmissionDTO) {
    if (data.monthlyIncome < 1000000) {
      throw new HttpError("Nasabah belum dapat mengajukan pinjaman", 422);
    }

    if (data.amount > 200000000) {
      throw new HttpError(
        "Nominal maksimal pinjaman yang dapat disetujui adalah 200 juta, Silahkan masukkan jumlah pinjaman yang sesuai dengan kebijakan yang berlaku.",
        422
      );
    }

    if (data.tenor > 24) {
      throw new HttpError(
        "Tenor pinjaman tertinggi adalah 24 bulan, Silahkan masukkan tenor yang sesuai dengan kebijakan yang berlaku.",
        422
      );
    }

    // Check maximum 3 submissions per applicant name
    const existingCount = await this.submissionRepo.countByFullname(data.fullName);
    if (existingCount >= 3) {
      throw new HttpError(
        "Maksimal pengajuan nasabah adalah sebanyak 3 kali, Silahkan masukkan jumlah pinjaman yang sesuai dengan kebijakan yang berlaku.",
        422
      );
    }

    const newId = await this.submissionRepo.create({
      userId: adminUserId,
      fullname: data.fullName,
      type: data.type,
      amount: String(data.amount),
      tenor: data.tenor,
      monthlyIncome: String(data.monthlyIncome),
      notes: data.notes || "",
      status: "SUBMIT",
    });

    const created = await this.submissionRepo.findById(newId);
    if (!created) {
      throw new HttpError("Failed to retrieve created submission", 500);
    }

    return {
      id: created.id,
      fullName: created.fullname,
      type: created.type,
      amount: parseFloat(String(created.amount)),
      tenor: created.tenor,
      monthlyIncome: parseFloat(String(created.monthlyIncome)),
      notes: created.notes || "",
    };
  }

}

export const submissionService = new SubmissionService();
