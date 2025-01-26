import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Relación con el modelo Product
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
