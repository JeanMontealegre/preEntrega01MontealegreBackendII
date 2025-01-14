import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import { comparePassword } from '../utils/password.utils.js';
import { hashPassword } from '../utils/password.utils.js';


const SECRET = 'mi_clave_secreta';

export const initializePassport = () => {
  // Estrategia de Registro
    passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
    }, async (req, email, password, done) => {
    try {
        const { first_name, last_name, age, role } = req.body;
        const hashedPassword = await hashPassword(password);
        const user = await User.create({ first_name, last_name, email, age, role, password: hashedPassword });
        done(null, user);
    } catch (error) {
        done(error, false);
    }
    }));

  // Estrategia de Login
    passport.use('login', new LocalStrategy({
    usernameField: 'email',
    }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user || !(await comparePassword(password, user.password))) {
            return done(null, false, { message: 'Credenciales inválidas' });
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
    }));

  // Estrategia JWT
    passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
    }, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (!user) return done(null, false, { message: 'Token inválido' });
        done(null, user);
    } catch (error) {
        done(error, false);
    }
    }));
};
