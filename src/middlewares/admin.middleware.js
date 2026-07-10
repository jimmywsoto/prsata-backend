export const ensureAdmin = (
  req,
  res,
  next
) => {

  try {

    if (!req.user) {

      return res.status(401)
        .json({
          error: 'No autenticado'
        });
    }

    // =========================
    // VALIDAR ROLE
    // =========================

    if (
      req.user.role !== 'superadmin'
    ) {

      return res.status(403)
        .json({
          error:
            'No autorizado'
        });
    }

    next();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error:
        'Error validando permisos'
    });
  }
};