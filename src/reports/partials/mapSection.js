export const buildMapSection = (
    reportData
) => `
<section class="section">

    <div class="section-title">
        Distribución Espacial
    </div>

    <img
        class="map-image"
        src="${reportData.map.image}"
    />

</section>
`;