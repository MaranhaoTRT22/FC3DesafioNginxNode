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
        'Roberto', 'Dinamite', 'dinamite@vasco.com.br'
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

        // body
        rows.forEach(row => {
            resultSet = resultSet +
            `<li>${row.nome} ${row.sobrenome} - ${row.email}</li>`
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
        </head>
        <body>
            <h1 class="display-1">Full Cycle Rocks!!</h1>
            <ul>
                ${resultSet}
            </ul>
        </body>
        </html>
    `
    );
});

app.listen(port, () => {
    console.log('Rodando na porta ' + port);
});