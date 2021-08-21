import mysql from 'mysql';
import { User } from '../api/models/user.js';
import { Enterprise } from '../api/models/enterprise.js'

// Cria conexão com o banco de dados
const db = mysql.createConnection({
    host: 'mysql-container',
    user: 'root',
    password: 'bluein',
    database: 'bluein'
});

// Se conecta ao banco de dados
db.connect((error) => {
    if(error) {
        throw('MYSQL Error: ', error);
    } else {
        console.log('MYSQL Connected...');
    }
});

let enterprises = [
    new Enterprise(1, 'Le Jardin'),
    new Enterprise(2, 'Evian'),
    new Enterprise(3, 'Olímpia Thermas')
];
fillEnterprisesVotes();

let users = [];
let whoVoted = [];
let usersEmail = [];
fillUsers();

// Retorna os e-mails de todos os usuários cadastrados
export function getUsersEmail() {
    return usersEmail;
}

// Preenche as variáveis de usuário no start do servidor, com os dados já existentes no banco
function fillUsers() {
    db.query('SELECT id, name, email, password, vote, vote_date, created_date FROM users', (error, results) => {
        if(error) {
            throw('Users Email Select Error: ', error);
        } else if(results.length > 0) {
            if(results.length == 1) {
                users.push(results[0]);
                whoVoted.push({name: results[0].name, date: results[0].vote_date});
                usersEmail.push(results[0].email);
            } else {
                users = results;
                users.forEach((user) => {
                    if(user.vote == 1) {
                        whoVoted.push({name: user.name, date: user.vote_date})
                    }
                });
                users.forEach((user) => usersEmail.push(user.email));
            }
        }
    });
}

// Preenche os votos de cada empreendimento, com dados já existentes no banco
function fillEnterprisesVotes() {
    for(let i = 0; i < enterprises.length; i++) {
        db.query('SELECT votes FROM enterprises WHERE id = ?', [i+1], (error, results) => {
            if(error) {
                throw('Votes Select Error: ', error);
            } else if(results.length > 0) {
                enterprises[i].votes = results[0].votes;
            }
        });
    }
}

// Verifica se as credenciais do usuário são válidas
export async function requestLogin(email, password) {
    const user = users.find((user) => user.email === email);
    try {
        if(user) {
            if(user.password === password) {
                return user.vote;
            } else {
                // Credenciais inválidas
                return 2;
            }
        } else {
            // Credenciais inválidas
            return 2;
        }
    } catch(error) {
        console.log('Erro durante a requisição de login: ', error);
    }
}

// Cria um novo usuário
export async function createUser(userData) {
    const { name, email, password } = userData;
    const user = new User(name, email, password, getDate());
    users.push({id: user.id, name: user.name, email: user.email, password: user.password, vote: user.vote, vote_date: user.vote_date});
    usersEmail.push(user.email);
    return await new Promise((resolve) => {
        db.query('INSERT INTO users (id, name, email, password, created_date) VALUES (?, ?, ?, ?, ?)', [user.id, user.name, user.email, user.password, user.created_date], (error) => {
            if(error) {
                return resolve('Create User Error: ', error);
            } else {
                console.log(`User with e-mmail ${email} added to the database.`);
                return resolve(true);
            }
        });
    });
}

// Computa o voto do usuário
export async function computeVote(data) {
    const {userEmail, enterpriseId} = data;
    const user = users.find((user) => user.email === userEmail);
    if(user.vote == 0) {
        user.vote = 1;
        user.vote_date = getDate();
        whoVoted.push({name: user.name, date: user.vote_date});
        const enterprise = enterprises[enterpriseId-1];
        enterprise.votes++;
        return await new Promise((resolve) => {
            db.query('UPDATE enterprises SET votes = ? WHERE id = ?', [enterprise.votes, enterpriseId], (error) => {
                if(error) {
                    console.log('Enterprise Update Error: ', error);
                    return resolve(3);
                }
            });
            db.query('UPDATE users SET vote = ?, enterpriseId = ?, vote_date = ? WHERE email = ?', [true, enterpriseId, user.vote_date, userEmail], (error) => {
                if(error) {
                    console.log('User Update Error: ', error);
                    return resolve(3);
                } else {
                    console.log(`User with e-mail ${userEmail} just voted, database updated.`);
                    return resolve(1);
                }
            });
        });
    } else {
        // Este usuário já votou
        return 2;
    }
}

// Retorna todos os dados necessários do resultado parcial da votação
export function getResult() {
    return {
        jardinVotes: enterprises[0].votes,
        evianVotes: enterprises[1].votes,
        olimpiaVotes: enterprises[2].votes,
        totalVotes: enterprises[0].votes + enterprises[1].votes + enterprises[2].votes,
        whoVoted: whoVoted
    };
}

// Retorna a data corrente formatada (dd/MM/aaaa)
function getDate(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}
