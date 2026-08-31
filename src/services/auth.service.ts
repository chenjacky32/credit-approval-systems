import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { userRepository, UserRepository } from "../repository/user.repository.js";
import { LoginDTO, RegisterDTO } from "../dto/auth.dto.js";
import { HttpError } from "../utils/custom-error.js";

export class AuthService {
  constructor(
    private userRepo: UserRepository = userRepository
  ) {}

  async register(data: RegisterDTO) {
    const existingUser = await this.userRepo.findByEmail(data.email);
    
    if (existingUser) {
      throw new HttpError("Email already exists", 409);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    await this.userRepo.create({
      fullname: data.fullname,
      email: data.email,
      password: hashedPassword,
      role: "CREDIT_ADMIN", // default role
    });

    return {
      message: "User registered successfully",
    };
  }

  async login(data: LoginDTO) {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new HttpError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    
    if (!isMatch) {
      throw new HttpError("Invalid credentials", 401);
    }

    const secret = process.env.JWT_SECRET || "defaultsecret";
    const expiresIn = (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"];

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      },
      secret,
      { expiresIn: expiresIn as any }
    );
    
    return {
      accessToken,
    };  

  }
}

export const authService = new AuthService();
