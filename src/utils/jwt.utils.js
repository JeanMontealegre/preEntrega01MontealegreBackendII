import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'mi_clave_secreta';

// Generar un token JWT
export const createToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

// Verificar un token JWT
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

