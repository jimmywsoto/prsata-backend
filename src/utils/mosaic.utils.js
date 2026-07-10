export default function getLatestMosaic(
  mosaics = [],
  options = {}
) {

  const {
    nameIncludes = null,
    productType = null
  } = options;

  let filtered = [...mosaics];

  // =========================
  // FILTRO POR NOMBRE
  // =========================

  if (nameIncludes) {

    filtered = filtered.filter(m =>
      m.name?.includes(nameIncludes)
    );
  }

  // =========================
  // FILTRO POR PRODUCT TYPE
  // =========================

  if (productType) {

    filtered = filtered.filter(m =>
      m.product_type === productType
    );
  }

  // =========================
  // ORDENAR POR FECHA
  // =========================

  filtered.sort((a, b) => {

    const da =
      new Date(a.first_acquired);

    const db =
      new Date(b.first_acquired);

    return db - da;
  });

  return filtered[0] || null;
}
