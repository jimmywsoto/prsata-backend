{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import * as UserModel from '../models/user.model.js';

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

export const createUser = async (req, res) => {
  const { username, email, password_hash, role } = req.body;
  try {
    const newUser = await UserModel.createUser({ username, email, password_hash, role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role, is_active } = req.body;

  //validar que solo usuario admin y superadmin puedan modificar role y is_active
  // pseudo lógica
  /*if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    delete updateData.role;
    delete updateData.is_active;
  }*/

  try {
    const existingUser = await UserModel.getUserById(id);
    if (!existingUser) return res.status(404).json({ error: 'Usuario no encontrado' });

    const updatedUser = await UserModel.updateUser(id, { username, email, role, is_active });
    res.json(updatedUser);
  } catch (error) {
    console.error('Error en controlador updateUser:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario', details: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await UserModel.getUserById(id);
    
    if (!existingUser) return res.status(404).json({ error: 'Usuario no encontrado' });

    await UserModel.deleteUser(id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error); // LOG completo
    res.status(500).json({ error: 'Error al eliminar el usuario', details: error.message });
  }
};