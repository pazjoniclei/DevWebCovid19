const db = require('./db')
const Sequelize = require('sequelize');

const sequelize = new Sequelize('apijoni', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(function () {
    console.log('Conexão realizada com sucesso');
}).catch(function (err) {
    console.log('Erro ao realizar a conexão com BD: ' + err);
});

const User = sequelize.define('usuarios', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    endereco: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telefone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    peso: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    altura: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    problemas_saude: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Criar a tabela
//User.sync({force: true})

module.exports = User