import { productsService } from "../repositories/index.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await productsService.getAll();
    res.json({ status: "success", products });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productsService.getById(req.params.pid);
    if (!product) return res.status(404).json({ status: "error", message: "Product not found" });
    res.json({ status: "success", product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productsService.create(req.body);
    res.status(201).json({ status: "success", product });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updated = await productsService.update(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ status: "error", message: "Product not found" });
    res.json({ status: "success", product: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await productsService.delete(req.params.pid);
    if (!deleted) return res.status(404).json({ status: "error", message: "Product not found" });
    res.json({ status: "success", message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
