export default class UsersRepository {

  constructor(dao) {
    this.dao = dao;
  }

  getUserByEmail(email) {
    return this.dao.getByEmail(email);
  }

  getUserById(id) {
    return this.dao.getById(id);
  }

  createUser(userData) {
    return this.dao.create(userData);
  }

  updateUser(id, data) {
    return this.dao.update(id, data);
  }

  deleteUser(id) {
    return this.dao.delete(id);
  }

  saveResetToken(userId, token, expires) {
  return this.dao.saveResetToken(userId, token, expires);
}

  getByResetToken(token) {
  return this.dao.getByResetToken(token);
  }
}