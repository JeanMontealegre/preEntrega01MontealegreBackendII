import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { initializePassport } from './config/passport.config.js';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.use('/api/auth', authRouter);

mongoose.connect('mongodb://localhost:27017/backend2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Base de datos conectada'))
    .catch(err => console.error('Error conectando a la base de datos', err));

app.listen(8080, () => {
    console.log('Servidor corriendo en http://localhost:8080');
});
