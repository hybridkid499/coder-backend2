import { UserCurrentDTO } from "../dto/user.current.dto.js";
import { usersService } from "../repositories/index.js";

export const currentSession = (req, res) => {
  // req.user viene de passport current
  const safeUser = new UserCurrentDTO(req.user);
  return res.json({ status: "success", user: safeUser });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { previewUrl } = await usersService.sendPasswordReset(email);

    return res.json({
      status: "success",
      message: "If that email exists, a recovery link was sent",
      ...(previewUrl && { previewUrl }),
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await usersService.resetPassword(token, newPassword);

    return res.json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};