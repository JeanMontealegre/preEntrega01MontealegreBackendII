import jwt from 'jsonwebtoken';

const SECRET = 'mi_clave_secreta';

export const createToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};
