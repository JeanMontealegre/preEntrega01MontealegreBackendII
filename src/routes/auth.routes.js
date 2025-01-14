import express from 'express';
import passport from 'passport';
import { createToken } from '../utils/jwt.utils.js';


const router = express.Router();

router.post('/register', passport.authenticate('register', { session: false }), (req, res) => {
    res.status(201).json({ message: 'Usuario registrado', user: req.user });
});

router.post('/login', passport.authenticate('login', { session: false }), (req, res) => {
    const token = createToken({ id: req.user._id, role: req.user.role });
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Login exitoso' });
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

export default router;
