import express from 'express';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
//import session from 'express-session';
import { enterprises, users } from './db/database.js';

const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// configs
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// get
app.get('/', (req, res) => res.render('index'));
app.get('/users', (req, res) => res.send(users));
app.get('/enterprises', (req, res) => res.send(enterprises));
app.get('/register', (req, res) => res.render('register'));
//app.get('/voting', (req, res) => res.render('voting'));
//app.get('/result', (req, res) => res.render('result'));

// post
/*app.post('/', async (req, res) => {
    res.render('index');
});
app.post('/register', (req, res) => {
    res.render('register');
});*/

// another routes
app.all("*", (req, res) =>res.send("Esta rota não existe."));

app.listen(PORT, HOST, () => console.log(`Server running on: http://localhost:${PORT}`));

export function login() {
    res.render('voting');
}