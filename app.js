const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const moment = require('moment');

app.engine('handlebars', handlebars({
	defaultLayout: 'main',
	helpers: {
		formatDate: (date) => {
			return moment(date).format('DD/MM/YYYY')
		}
	}
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'apijoni'
})

connection.connect(function(err){
    if (err) console.error('Erro ao realizar a conexao com o BD: '+ err.stack); 
    return;
});

// home
app.get('/', (req, res) => {
	res.redirect('/add-paciente')
});
//cadastrar paciente
app.get('/add-paciente', (req, res) => {
	res.render('add-paciente')	
});

//listar pacientes
app.get('/listar-pacientes', (req, res) => {
	const query = 'SELECT * FROM pacientes';	
	connection.query(query, (err, results, fields) => {
    	if (err) {
    		console.error(err);
    		res.json({
    			success: false,
    			message: 'Algum erro ocorreu...'
    		});
    	} else {
			res.render('listar-pacientes', {results: results })
    	}
	});	
});

//listar paciente individual
app.get('/buscar-paciente', (req, res) => {
	const query = 'SELECT * FROM pacientes';	
	connection.query(query, (err, results, fields) => {
    	if (err) {
    		console.error(err);
    		res.json({
    			success: false,
    			message: 'Algum erro ocorreu...'
    		});
    	} else {
			res.render('buscar-paciente', {results: results })
    	}
	});	
});

app.post('/cad-paciente', (req, res) => {

	const data = req.body;
	const query = `INSERT INTO pacientes (nome, email, cpf, telefone, endereco, data_internacao) VALUES ('${data.nome}', '${data.email}', '${data.cpf}', '${data.telefone}', '${data.endereco}', '${data.data_internacao}');`;

	connection.query(query, (err, results, fields) => {
    	if (err) {
    		console.error(err);
    		res.json({
    			success: false,
    			message: 'Algum erro ocorreu...' + err
    		});
    	} else {
			res.render('tela_sucesso')
    	}
	});
});

app.get('/listar-paciente', (req, res) => {
	let filter = '';
	let queryPacienteID = req.query.paciente_id;
    if(queryPacienteID) filter = ' WHERE ID =' + parseInt(queryPacienteID);
	const query = 'SELECT * FROM pacientes'+ filter;
    connection.query(query, (err, results, fields) => {
    	if (err) {
    		console.error(err);
    		res.json({
    			success: false,
    			message: 'Algum erro ocorreu...'
    		});
    	} else {
			res.render('listar-paciente', {results: results })
    	}
    });
});

app.get('/deletar-paciente/:id', (req, res) => {
	let filter = '';
	if(req.params.id) filter = ' WHERE ID=' + parseInt(req.params.id);
	const query = 'DELETE FROM pacientes'+ filter;
    connection.query(query, (err, results, fields) => {
    	if (err) {
    		console.error(err);
    		res.json({
    			success: false,
    			message: 'Algum erro ocorreu ao deletar...' + err
    		});
    	} else {
			res.redirect('/listar-pacientes')
    	}
    });
});

// //localhost:8080/usuarios
// router.get('/usuarios', (req, res) => {
//     conexao.findAll().then(function(usuarios){ 
//         return res.json(usuarios)
//     }).catch(function(erro){
//         return res.json({ message: "Erro ao listar usuários. " + erro });
//     })  
// });

// //localhost:8080/usuarios/id
// router.get('/usuarios/:id', (req, res) => { 
//     conexao.findAll({
//         where: {
//             id: Number(req.params.id)
//         }
//     }).then(function(usuario){ 
//         return res.json(usuario);
//     }).catch(function(erro){
//         return res.json({ message: "Erro ao buscar usuário. " + erro });
//     })      
// })

// //localhost:8080/usuarios/id
// router.patch('/usuarios/:id', (req, res) => {
//     conexao.update({ nome: req.body.nome }, {
//         where: {
//             id: Number(req.params.id)
//         }
//     }).then(function(){
//         return res.json({ message: "Usuário atualizado." });
//     }).catch(function(erro){
//         return res.json({ message: "Erro ao atualizar usuário. " + erro });
//     }) 
// })

// //localhost:8080/usuarios/id
// router.delete('/usuarios/:id', (req, res) => {    
//     conexao.destroy({
//         where: {
//             id: Number(req.params.id)
//         }
//     }).then(function(){ 
//         return res.json({ message: "Usuário deletado." });
//     }).catch(function(erro){
//         res.send("Erro ao deletar usuário. " + erro)
//     })    
// })

app.listen(8080);