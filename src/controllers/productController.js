import Product from '../models/Product.js';

// Obtener todos los productos con paginación, filtros y ordenamiento
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'asc', query = '', available } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { price: sort === 'asc' ? 1 : -1 },
    };

    const filter = {};

    if (query) {
      filter.category = query;
    }

    if (available) {
      filter.availability = available === 'true';
    }

    const products = await Product.paginate(filter, options);

    res.status(200).json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/api/products?page=${products.prevPage}&limit=${limit}`
        : null,
      nextLink: products.hasNextPage
        ? `/api/products?page=${products.nextPage}&limit=${limit}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, availability } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      availability: availability !== undefined ? availability : true,
    });

    await newProduct.save();

    // Emitir evento si Socket.IO está configurado (opcional)
    const io = req.app.get('io');
    if (io) {
      io.emit('newProduct', newProduct);
    }

    res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo crear el producto', error: error.message });
  }
};

// Actualizar un producto por su ID
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('updateProduct', updatedProduct);
    }

    res.status(200).json({ message: 'Producto actualizado con éxito', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo actualizar el producto', error: error.message });
  }
};

// Eliminar un producto por su ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('deleteProduct', deletedProduct);
    }

    res.status(200).json({ message: 'Producto eliminado', product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo eliminar el producto', error: error.message });
  }
};