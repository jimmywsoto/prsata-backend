export const reportStyles = () => `
<style>

* {
    box-sizing: border-box;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
    margin: 0;
    padding: 0;
}

@page {
    size: A4;
    margin: 20mm 15mm;
}

.page {
    width: 100%;
}

.page-break {
    page-break-before: always;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #16a34a;
    padding-bottom: 12px;
    margin-bottom: 20px;
}

.header img {
    width: 100%;
}

.header-data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #16a34a;
    padding-bottom: 12px;
    margin-bottom: 20px;
}

.logo {
    width: 90px;
    
}

.header-info {
    text-align: right;
}

.header-title {
    font-size: 22px;
    font-weight: bold;
    color: #166534;
}

.subtitle {
    color: #6b7280;
    font-size: 13px;
}

.section {
    margin-bottom: 25px;
}

.section-title {
    color: #166534;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    border-left: 5px solid #16a34a;
    padding-left: 10px;
    border-bottom: 1px solid #16a34a67;
}

.cards-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.cards {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.card {
    flex: 1;
    min-width: 180px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 10px;
    text-align: center;
}

.card-value {
    font-size: 30px;
    font-weight: bold;
    color: #166534;
}

.card-label {
    font-size: 13px;
    color: #6b7280;
}

.map-image {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 12px;
}

.chart-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.chart-grid-one {
    width: 100%;
    padding: 0 50px;
}

.chart-grid-two {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 0 50px;
}

.chart-single {
    padding: 10px;
}

.chart-image {
    width: 100%;
    max-height: 450px;
    padding: 10px;
}

.summary-box {
    background: #f0fdf4;
    border-left: 5px solid #16a34a;
    padding: 15px;
    border-radius: 10px;
}

.table-container {
    width: 100%;
    display: flex;
    justify-content: center;
}


table {
    width: 500px;
    border-collapse: collapse;
}

thead {
    display: table-header-group;
}

th {
    background: #166534;
    color: white;
    padding: 10px;
    font-size: 12px;
    text-align: left;
}

td {
    padding: 6px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 12px;
}

tr {
    page-break-inside: avoid;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 10px;
    color: #6b7280;
    border-top: 1px solid #d1d5db;
    padding-top: 5px;
    text-align: center;
}

.cover {
    width: 100%;
    height: 900px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 25px;
}

.cover h1 {
    font-size: 2rem;

}

.cover h2 {
    font-weight: normal;

}

.cover img {
    width: 250px;
}


</style>
`;