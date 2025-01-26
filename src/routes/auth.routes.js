import express from 'express';
import UserModel from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.utils.js';
import { createToken, verifyToken } from '../utils/jwt.utils.js';

const router = express.Router();

// Registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    // Validar que todos los campos estén presentes
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await hashPassword(password);

    // Crear el usuario en la base de datos
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role: role || 'user',
    });

    res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
});

// Login de usuarios
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que los campos estén presentes
    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    }

    // Buscar al usuario en la base de datos
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar la contraseña
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = createToken({ id: user._id, role: user.role });

    // Configurar el token como cookie
    res.cookie('token', token, { httpOnly: true });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});

// Obtener usuario actual
router.get('/current', async (req, res) => {
  try {
    // Obtener el token de los headers
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No autorizado, token faltante' });
    }

    // Extraer el token después de "Bearer "
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token); // Decodificar el token para obtener el payload

    // Buscar al usuario en la base de datos
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Enviar los datos del usuario
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario actual', error: error.message });
  }
});

export default router;
