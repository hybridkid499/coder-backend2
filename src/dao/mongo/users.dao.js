import User from "../../models/user.model.js";

export default class UsersDAO {

  async getByEmail(email) {
    return await User.findOne({ email });
  }

  async getById(id) {
    return await User.findById(id);
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async saveResetToken(userId, token, expires) {
  return await User.findByIdAndUpdate(
    userId,
    {
      resetToken: token,
      resetTokenExpires: expires,
    },
    { new: true }
  );
}

async getByResetToken(token) {
  return await User.findOne({ resetToken: token });
}

}