{/* 
    COPYRIGHTS: JWS INGENIERÍA 
    CREATE AT: 09/01/2026
    LAST MODIFIED: 09/01/2026
    VERSIÓN: 1.0.0
*/}

import fs from 'fs/promises';
import * as resourceService from '../services/resource.service.js';

export const getAllResources = async (req, res) => {
  const resources = await resourceService.findAll();
  res.json(resources);
};

// GET /api/resources/:element_id
export const getResourceByElementId = async (req, res) => {
  const recurso = await resourceService.findByElementId(req.params.element_id);
  if (!recurso) return res.status(404).json({ error: 'Recurso no encontrado' });
  res.json(recurso);
};

// POST /api/resources
export const createResource = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { name, type, content, category } = req.body;
    let url = req.body.url || '';

    const nuevo = await resourceService.create({
      user_id,
      name,
      type,
      //content: type === 'image' ? '' : content, // para imágenes no guardamos base64
      content,
      url,
      category,
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/resources/:element_id
export const updateResource = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { name, content, category, type } = req.body;
    let url = req.body.url || '';

    // ─── NUEVO: si llega nueva imagen ────────────────
    if (type === 'image' && req.file) {
      const { link } = await uploadImageToDrive(req.file.path, req.file.originalname);
      url = link;
      await fs.unlink(req.file.path);
    }

    const actualizado = await resourceService.update(req.params.element_id, user_id, {
      name,
      content: type === 'image' ? '' : content,
      url,
      category,
    });

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/resources/:element_id
export const deleteResource = async (req, res) => {
  try {
    await resourceService.remove(req.params.element_id);
    res.json({ message: 'Recurso eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};