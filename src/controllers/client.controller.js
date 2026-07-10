{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import * as ClientModel from '../models/client.model.js';

// Obtener todos los clientes
export const getClients = async (req, res) => {
  try {
    const clients = await ClientModel.getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

// Obtener cliente por ID
export const getClient = async (req, res) => {
  try {
    const client = await ClientModel.getClientById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};

// Obtener clientes del usuario autenticado
export const getMyClients = async (req, res) => {
  try {
    const userId = req.user.id; // requiere middleware auth
    const clients = await ClientModel.getClientsByUser(userId);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes del usuario' });
  }
};

// Crear cliente
export const createClient = async (req, res) => {
  const { company, legal_rep, contact_number, created_by } = req.body;

  try {
    const newClient = await ClientModel.createClient({
      company,
      legal_rep,
      contact_number,
      created_by // created_by: req.user.id importante: viene del token
    });

    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cliente', details: error.message });
  }
};

// Actualizar cliente
export const updateClient = async (req, res) => {
  const { id } = req.params;
  const { company, legal_rep, contact_number, is_active } = req.body;

  try {
    const existingClient = await ClientModel.getClientById(id);
    if (!existingClient) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // (Opcional) Validar propiedad del registro
    if (existingClient.created_by !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const updatedClient = await ClientModel.updateClient(id, {
      company,
      legal_rep,
      contact_number,
      is_active
    });

    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar el cliente',
      details: error.message
    });
  }
};

// Eliminar cliente
export const deleteClient = async (req, res) => {
  const { id } = req.params;
  const { created_by } = req.body;

  try {
    const existingClient = await ClientModel.getClientById(id);

    if (!existingClient) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    console.log(existingClient.created_by, created_by)
    // Validar propiedad
    /*if (existingClient.created_by !== created_by) {
      return res.status(403).json({ error: 'No autorizado' });
    }*/

    await ClientModel.deleteClient(id);

    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar el cliente',
      details: error.message
    });
  }
};