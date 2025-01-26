import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', getAllProducts);

// Crear un nuevo producto
router.post('/', createProduct);

// Actualizar un producto por su ID
router.put('/:id', updateProduct);

// Eliminar un producto por su ID
router.delete('/:id', deleteProduct);

export default router;
