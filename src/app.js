import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './db/database.js';
import authRouter from './routes/auth.routes.js';
import cartsRouter from './routes/carts.js';
import productsRouter from './routes/products.js';
import path from 'path';
import { engine } from 'express-handlebars';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware para compartir Socket.IO con los controladores
app.use((req, res, next) => {
  req.app.set('io', io);
  next();
});

// Conexión a MongoDB
connectDB();

// Configuración de Handlebars
const __dirname = path.resolve();
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Middlewares generales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

// Endpoint para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  res.render('realtimeproducts', { title: 'Productos en Tiempo Real' });
});

// Socket.IO - Manejo de conexiones
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

