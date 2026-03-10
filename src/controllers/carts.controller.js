import { cartsService } from "../repositories/index.js";

export const getCartById = async (req, res) => {
  try {
    const cart = await cartsService.getCart(req.params.cid);
    res.json({ status: "success", cart });
  } catch (err) {
    res.status(404).json({ status: "error", message: err.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const qty = Number(req.body.quantity || 1);

    const cart = await cartsService.addProductToCart(cid, pid, qty);
    res.json({ status: "success", cart });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const purchaserEmail = req.user.email;

    const result = await cartsService.purchase(cid, purchaserEmail);
    res.json({ status: "success", ...result });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};