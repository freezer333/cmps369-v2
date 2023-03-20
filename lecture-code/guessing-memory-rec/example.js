
const data = require('./data.json');
console.log(data);

const objects = [
    { a: 4, b: 5 },
    { a: 5, b: 5 },
    { a: 4, b: 3 },
    { a: 8, b: 5 },
    { a: 4, b: 2 },
];

const table =
    `
    <table>
    <thead>
        <tr>
            <th>A</th>
            <th>B</th>
        </tr>
    </thead>
    <tbody>
    
        ${data.map(i => `<tr>
            <td>
                <a href="something/${i.a}">${i.a}</a>
            </td>
            <td>${i.b}</td>
        </tr>`).join("")}
    </tbody>
    </table>
    `;

console.log(table)


