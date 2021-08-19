import ejs from 'ejs';
import path from 'path';
import express from 'express';
//import session from 'express-session';
import { fileURLToPath } from 'url';
import { getUsersEmail, requestLogin, createUser, computeVote, getResult } from './api/database.js';

const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// configs
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// get
app.get('/', (req, res) => res.render('index'));
app.get('/register', (req, res) => res.render('register', {usersEmail: JSON.stringify(getUsersEmail())}));
app.get('/voting', (req, res) => res.render('voting', {userEmail: 'victor_olivery@hotmail.com'}));
app.get('/computed', (req, res) => res.render('computed'));
app.get('/result', (req, res) => res.render('result', res.render('result', {result: JSON.stringify(getResult())})));

// post
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const vote = await requestLogin(email, password);
    if(vote == 0) {
        res.render('voting', {userEmail: email});
    } else if(vote == 1) {
        res.render('computed');
    } else if(vote == 2) {
        res.status(401).json({message: 'Credenciais inválidas'});
    } else {
        res.status(500).json({message: 'Erro durante a requisição de login'});
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
        res.status(500).json({message: 'Erro durante a computação do voto'});
    }
});

// Redirect to Login Page
app.all("*", (req, res) => res.redirect('/'));

app.listen(PORT, HOST, () => console.log(`Server running on: http://localhost:${PORT}`));