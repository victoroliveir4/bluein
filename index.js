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

// Requisições GET
app.get('/', (req, res) => res.render('index', {auth: false, error: false}));
app.get('/register', (req, res) => res.render('register', {registeredUser: false, error: false, usersEmail: JSON.stringify(getUsersEmail())}));
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
app.post('/', async (req, res, next) => {
    const { email, password } = req.body;
    const vote = await requestLogin(email, password);
    // Usuário autenticado, não votou
    if(vote == 0) {
        req.session.loggedIn = true;
        req.session.email = email;
        res.status(200).render('voting', {userEmail: email});
    // Usuário autenticado, já votou
    } else if(vote == 1) {
        req.session.loggedIn = true
        req.session.email = email;
        res.status(202).render('computed');
    } else if(vote == 2) {
        // E-mail e/ou senha incorretos
        res.status(401).render('index', {auth: true, error: false});
    } else {
        res.status(500).render('index', {auth: false, error: true});
    }
});
app.post('/register', async (req, res) => {
    if(await createUser(req.body)) {
        // Usuário cadastrado com sucesso
        res.status(201).render('register', {registeredUser: true, error: false, usersEmail: JSON.stringify(getUsersEmail())});
    } else {
        res.status(500).render('register', {registeredUser: false, error: true, usersEmail: null});
    }
});
app.post('/vote', async (req, res) => {
    if(await computeVote(req.body)) {
        // Voto computado com sucesso
        res.status(200).render('computed');
    } else {
        // Este usuário já votou, redirecionando para a tela de login
        req.session.destroy();
        res.redirect('/');
    }
});

// Redireciona para a página de login, caso a rota não exista
app.all("*", (req, res) => res.redirect('/'));

app.listen(PORT, HOST, () => console.log(`Server running on: http://localhost:${PORT}`));