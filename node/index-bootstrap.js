const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;
const config = {
    host: 'bd',
    user: 'laom',
    password: 'vasco',
    database: 'nodebd'
};

let sql;
let resultSet = ``;
let fieldSet = ``;

const conexao = mysql.createConnection(config);
conexao.addListener('error', (err) => {
    console.log(err);
});

conexao.connect(function (err) {
    if (err) throw err;
    console.log('Conectado ao banco ' + config.database);

    const tabelaMembros =
        'CREATE TABLE IF NOT EXISTS people ' +
        '(id INT AUTO_INCREMENT PRIMARY KEY, ' +
        'nome VARCHAR(255), ' +
        'sobrenome VARCHAR(255), ' +
        'email VARCHAR(255))';
    conexao.query(tabelaMembros, (err, result, fields) => {
        if (err instanceof Error) {
            console.log(err);
            return;
        }

        if (result.warningStatus == 0) {
            console.log('Tabela "people" criada!');
        } else {
            console.log('Tabela "people" já existe!');
        }
    });

    sql = 'INSERT INTO people(nome, sobrenome, email) VALUES (?,?,?), (?,?,?), (?,?,?)';
    const values = [
        'Luiz', 'Maranhao', 'laom@trt22.jus.br',
        'Carlos', 'Germano', 'cgermano@vasco.com.br',
        'Wesley', 'Willians', 'wesleywillians@fullcycle.com'
    ];
    conexao.execute(sql, values, (err, result, fields) => {
        if (err instanceof Error) {
            console.log(err);
            return;
        }
        
        console.log('Registros inseridos com sucesso!');
    });

    sql = 'SELECT * FROM people ORDER BY id';
    conexao.query(sql, (err, rows, fields) => {
        if (err instanceof Error) {
            console.log(err);
            return;
        }

        // head
        fields.forEach(field => {
            fieldSet = fieldSet + `<th>${field.name}</th>`
        });
        // body
        rows.forEach(row => {
            resultSet = resultSet +
            `<tr>
                <td>${row.id}</td>
                <td>${row.nome}</td>
                <td>${row.sobrenome}</td>
                <td>${row.email}</td>
            </tr>`
        });        
    });

});

app.get('/', (req, res) => {
    res.send(
        `
        <!doctype html>
        <html lang="pt-BR" data-bs-theme="dark">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>FC3 Nginx Node MySQL Demo</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <div class="text-center">
                    <h1 class="display-1">Full Cycle Rocks!!</h1>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>${fieldSet}</tr>
                        </thead>
                        <tbody>
                            ${resultSet}
                        </tbody>
                    </table>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </body>
        </html>
    `
    );
});

app.listen(port, () => {
    console.log('Rodando na porta ' + port);
});