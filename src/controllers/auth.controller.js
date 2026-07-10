{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import { createUser, findUserByEmail, updateLastLogin, updatePassword } from '../models/user.model.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    const password_hash = await hashPassword(password);

    const newUser = await createUser({ username, email, password_hash, role: role || 'user', is_active: false });

    const token = generateToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'No se pudo registrar el usuario' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    await updateLastLogin(user.id);
    
    const token = generateToken(user);

    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'No se pudo iniciar sesión' });
  }
};

export const resetpass = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    const password_hash = await hashPassword(password);

    const updatedUser = await updatePassword(id, { password_hash });

    res.status(201).json({ user: updatedUser });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ error: 'No se pudo restablecer la contraseña' });
  }
};