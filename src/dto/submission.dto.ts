import { z } from "zod";

export const CreateSubmissionSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nama lengkap nasabah is required")
    .max(100, "Nama lengkap nasabah max 100 characters"),
  type: z.enum(["MOTORCYCLE", "CAR", "MULTIPURPOSE"]),
  amount: z
    .number()
    .positive("Nominal pengajuan harus lebih dari 0")
    .max(
      200000000,
      "Nominal maksimal pinjaman yang dapat disetujui adalah 200 juta, Silahkan masukkan jumlah pinjaman yang sesuai dengan kebijakan yang berlaku."
    ),
  tenor: z
    .number()
    .int("Tenor must be an integer")
    .positive("Tenor harus lebih dari 0")
    .max(
      24,
      "Tenor pinjaman tertinggi adalah 24 bulan, Silahkan masukkan tenor yang sesuai dengan kebijakan yang berlaku."
    ),
  monthlyIncome: z
    .number()
    .min(1000000, "Nasabah belum dapat mengajukan pinjaman"),
  notes: z.string().optional().default(""),
});

export const QuerySubmissionListSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  size: z.coerce.number().int().positive().optional().default(10),
  search: z.string().optional(),
  status: z.enum(["SUBMIT", "APPROVE", "REJECT"]).optional(),
});

