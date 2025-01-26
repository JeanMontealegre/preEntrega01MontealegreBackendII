import express from 'express';
import {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  emptyCart,
  updateProductQuantity,
} from '../controllers/cartController.js';

const router = express.Router();

// Crear un nuevo carrito
router.post('/', createCart);

// Obtener un carrito por su ID
router.get('/:cid', getCartById);

// Agregar un producto al carrito
router.post('/:cid/product/:pid', addProductToCart);

// Eliminar un producto específico del carrito
router.delete('/:cid/product/:pid', deleteProductFromCart);

// Vaciar completamente el carrito
router.delete('/:cid', emptyCart);

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/product/:pid', updateProductQuantity);

export default router;

