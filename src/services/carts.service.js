import crypto from "crypto";
import Ticket from "../models/ticket.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

export default class CartsService {
  constructor(repository) {
    this.repository = repository;
  }

  async getCart(cid) {
    const cart = await this.repository.getById(cid);
    if (!cart) throw new Error("Cart not found");
    return cart;
  }

  async addProductToCart(cid, pid, qty = 1) {
    const cartDoc = await Cart.findById(cid);
    if (!cartDoc) throw new Error("Cart not found");

    const product = await Product.findById(pid);
    if (!product) throw new Error("Product not found");

    const index = cartDoc.products.findIndex((p) => p.product.toString() === pid);

    if (index >= 0) {
      cartDoc.products[index].quantity += qty;
    } else {
      cartDoc.products.push({ product: pid, quantity: qty });
    }

    await cartDoc.save();
    return await Cart.findById(cid).populate("products.product").lean();
  }

  async purchase(cid, purchaserEmail) {
    const cartDoc = await Cart.findById(cid).populate("products.product");
    if (!cartDoc) throw new Error("Cart not found");

    const purchasable = [];
    const notPurchasable = [];

    let totalAmount = 0;

    for (const item of cartDoc.products) {
      const product = item.product;
      const quantity = item.quantity;

      if (product.stock >= quantity) {
        purchasable.push({ product, quantity });
        totalAmount += product.price * quantity;
      } else {
        notPurchasable.push({ product, quantity });
      }
    }

    // descontar stock solo de los comprables
    for (const item of purchasable) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // generar ticket si hubo compra
    let ticket = null;
    if (purchasable.length > 0) {
      ticket = await Ticket.create({
        code: crypto.randomUUID(),
        amount: totalAmount,
        purchaser: purchaserEmail,
      });
    }

    // el carrito queda con los NO comprables (compra incompleta)
    cartDoc.products = notPurchasable.map((x) => ({
      product: x.product._id,
      quantity: x.quantity,
    }));
    await cartDoc.save();

    return {
      ticket,
      notPurchased: notPurchasable.map((x) => ({
        product: {
          id: x.product._id,
          title: x.product.title,
          stock: x.product.stock,
          price: x.product.price,
        },
        quantity: x.quantity,
      })),
    };
  }
}