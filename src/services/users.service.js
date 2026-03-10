import crypto from "crypto";
import { createTransport } from "../config/mailer.js";
import { createHash, isValidPassword } from "../utils/hash.js";


export default class UsersService {

  constructor(repository) {
    this.repository = repository;
  }

  async registerUser(userData) {
    return await this.repository.createUser(userData);
  }

  async findUserByEmail(email) {
    return await this.repository.getUserByEmail(email);
  }

  async findUserById(id) {
    return await this.repository.getUserById(id);
  }
   

  async sendPasswordReset(email) {
  const user = await this.repository.getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await this.repository.saveResetToken(user._id, token, expires);

  const resetLink = `${process.env.RESET_BASE_URL}/reset-password?token=${token}`;

  const transporter = await createTransport();

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || "no-reply@ecommerce.com",
    to: user.email,
    subject: "Password reset",
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Hacé click en el botón para restablecer tu contraseña:</p>
      <a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#222;color:#fff;text-decoration:none;border-radius:6px;">
        Restablecer contraseña
      </a>
      <p>Este enlace expira en 1 hora.</p>
    `,
  });

  return info;
}

async resetPassword(token, newPassword) {
  const user = await this.repository.getByResetToken(token);
  if (!user) throw new Error("Invalid token");

  if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
    throw new Error("Expired token");
  }

  if (isValidPassword(newPassword, user.password)) {
    throw new Error("New password must be different from the current one");
  }

  const hashedPassword = createHash(newPassword);

  return await this.repository.updateUser(user._id, {
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null,
  });
}
}