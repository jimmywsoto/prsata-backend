export const generateReportHtml = async (reportData) => {

    const html = `
    <!DOCTYPE html>
    <html>
    <head>

        <meta charset="utf-8"/>

        <style>

            body{
                font-family: Arial, sans-serif;
                margin:0;
                padding:20px;
            }

            .title{
                font-size:24px;
                font-weight:bold;
            }

            img{
                max-width:100%;
            }

        </style>

    </head>

    <body>

        <div class="title">
            Reporte Cartográfico
        </div>

        <img src="${reportData.metadata.logo}" />

    </body>

    </html>
    `;

    return html;
};