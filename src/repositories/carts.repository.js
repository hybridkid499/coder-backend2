export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getById(id) {
    return this.dao.getById(id);
  }

  create() {
    return this.dao.create();
  }

  update(id, data) {
    return this.dao.update(id, data);
  }
}