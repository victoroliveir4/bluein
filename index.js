import ejs from 'ejs';
import path from 'path';
import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { getUsersEmail, requestLogin, createUser, computeVote, getResult } from './api/database.js';

const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurações
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({secret:'1fh6a4ffalf9g7s5hfks7r6rwjwldfhhh7', name:'uniqueSessionID', saveUninitialized: false}));

// Adicionando headers antes das rotas serem definidas
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://54.234.126.98:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Requisições GET
app.get('/', (req, res) => res.render('index'));
app.get('/register', (req, res) => res.render('register', {usersEmail: JSON.stringify(getUsersEmail())}));
app.get('/voting', (req, res) => {
    if(req.session.loggedIn) {
        res.render('voting', {userEmail: req.session.email});
    } else {
        res.redirect('/');
    }
});
app.get('/computed', (req, res) => {
    if(req.session.loggedIn) {
        res.render('computed');
    } else {
        res.redirect('/');
    }
});
app.get('/result', (req, res) => res.render('result', res.render('result', {result: JSON.stringify(getResult())})));
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Requisições POST
app.post('/', async (req, res) => {
    const { email, password } = req.body;
    const vote = await requestLogin(email, password);
    if(vote == 0) {
        req.session.loggedIn = true;
        req.session.email = email;
        res.status(200).json({message: 'Usuário autenticado, não votou'});
    } else if(vote == 1) {
        req.session.loggedIn = true
        req.session.email = email;
        res.status(202).json({message: 'Usuário autenticado, já votou'});
    } else if(vote == 2) {
        res.status(401).json({message: 'Credenciais inválidas'});
    } else {
        res.status(500).json({message: 'Ocorreu um erro durante a requisição de login'});
    }
});
app.post('/register', async (req, res) => {
    if(await createUser(req.body)) {
        res.status(201).json({message: 'Usuário cadastrado com sucesso'});
    } else {
        res.status(500).json({message: 'Erro durante o cadastro do usuário no banco'});
    }
});
app.post('/vote', async (req, res) => {
    if(await computeVote(req.body)) {
        res.status(200).json({message: 'Voto computado com sucesso'});
    } else {
        res.status(400).json({message: 'Este usuário já votou'});
    }
});

// Redireciona para a página de login, caso a rota não exista
app.all("*", (req, res) => res.redirect('/'));

app.listen(PORT, HOST, () => console.log(`Server running on: http://localhost:${PORT}`));