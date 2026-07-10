export const buildHeaderData = ({
    title,
    subtitle,
    generatedAt,
    logo,
    reportVersion
}) => `
<div class="header-data">

    <div>
        ${
            logo
                ? `<img src="${logo}" class="logo"/>`
                : ""
        }
    </div>

    <div class="header-info">

        <div class="header-title">
            ${title}
        </div>

        <div class="subtitle">
            ${subtitle}
        </div>

        <div class="subtitle">
            Generado:
            ${generatedAt}
        </div>

        <div class="subtitle">
            Versión:
            ${reportVersion}
        </div>

    </div>

</div>
`;