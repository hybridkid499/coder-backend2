import UsersDAO from "../dao/mongo/users.dao.js";
import UsersRepository from "./users.repository.js";
import UsersService from "../services/users.service.js";
import ProductsDAO from "../dao/mongo/products.dao.js";
import ProductsRepository from "./products.repository.js";
import ProductsService from "../services/products.service.js";
import CartsDAO from "../dao/mongo/carts.dao.js";
import CartsRepository from "./carts.repository.js";
import CartsService from "../services/carts.service.js";

const usersDAO = new UsersDAO();
const usersRepository = new UsersRepository(usersDAO);
export const usersService = new UsersService(usersRepository);

const productsDAO = new ProductsDAO();
const productsRepository = new ProductsRepository(productsDAO);
export const productsService = new ProductsService(productsRepository);

const cartsDAO = new CartsDAO();
const cartsRepository = new CartsRepository(cartsDAO);
export const cartsService = new CartsService(cartsRepository);