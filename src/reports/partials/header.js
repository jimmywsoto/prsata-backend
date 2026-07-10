export const buildHeader = ({
    header
}) => `
<div class="header page-break">

    <div>
        ${
            header
                ? `<img src="${header}" class="header-logo"/>`
                : ""
        }
    </div>

</div>
`;