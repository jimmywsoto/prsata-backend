import { planetApi } from "./planet.service.js";

export default async function getAllMosaics() {

  let mosaics = [];

  let nextUrl =
    "/basemaps/v1/mosaics?_page_size=50";

  while (nextUrl) {

    console.log(
      "Consultando:",
      nextUrl
    );

    const response =
      await planetApi.get(nextUrl);

    const data = response.data;

    // =========================
    // ACUMULAR MOSAICOS
    // =========================

    mosaics.push(
      ...(data.mosaics || [])
    );

    // =========================
    // SIGUIENTE PÁGINA
    // =========================

    nextUrl =
      data._links?._next || null;

    // =========================
    // PLANET DEVUELVE URL ABSOLUTA
    // AXIOS YA TIENE baseURL
    // NECESITAMOS CONVERTIR
    // =========================

    if (nextUrl) {

      nextUrl = nextUrl.replace(
        "https://api.planet.com",
        ""
      );
    }
  }

  return mosaics;
}