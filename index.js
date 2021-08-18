import ejs from 'ejs';
import path from 'path';
import express from 'express';
//import session from 'express-session';
import { fileURLToPath } from 'url';
import { getUsersEmail, requestLogin, createUser, computeVote } from './api/database.js';

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
app.get('/voting', (req, res) => res.render('voting'));
app.get('/result', (req, res) => res.render('result'));

// post
app.post('/login', async (req, res) => {
    const userData = await requestLogin(req.body);
    if(userData) {
        const vote = userData.vote;
        if(vote == 0) {
            res.status(200).json({message: 'Usuário autenticado'});
        } else if(vote == 1) {
            // go to other page
        } else {
            res.status(401).json({message: 'Credenciais inválidas'});
        }
    } else {
        res.status(500).json({message: 'Erro durante a requisição de login'});
    }
});
app.post('/register', async (req, res) => {
    if(await createUser(req.body)) {
        res.status(200).json({message: 'Usuário cadastrado com sucesso'});
    } else {
        res.status(500).json({message: 'Erro durante o cadastro do usuário no banco'});
    }
});
/*app.post('/vote', async (req, res) => {
    await computeVote(req.body);
});*/

// Redirect to Login Page
app.all("*", (req, res) => res.redirect('/'));

app.listen(PORT, HOST, () => console.log(`Server running on: http://localhost:${PORT}`));