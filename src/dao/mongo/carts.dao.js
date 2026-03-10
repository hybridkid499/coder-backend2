import Cart from "../../models/cart.model.js";

export default class CartsDAO {
  async getById(id) {
    return await Cart.findById(id).populate("products.product").lean();
  }

  async create() {
    return await Cart.create({ products: [] });
  }

  async update(id, data) {
    return await Cart.findByIdAndUpdate(id, data, { new: true });
  }
}