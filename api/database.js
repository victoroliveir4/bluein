import mysql from 'mysql';
import { User } from '../api/models/user.js';
import { Enterprise } from '../api/models/enterprise.js'

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'firebee00',
    database: 'bluein'
});

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

export function getUsersEmail() {
    return usersEmail;
}

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

export async function computeVote(data) {
    const {userEmail, enterpriseId} = data;
    const user = users.find((user) => user.email === userEmail);
    user.vote = 1;
    user.vote_date = getDate();
    whoVoted.push({name: user.name, date: user.vote_date});
    const enterprise = enterprises[enterpriseId-1];
    enterprise.votes++;
    return await new Promise((resolve) => {
        db.query('UPDATE enterprises SET votes = ? WHERE id = ?', [enterprise.votes, enterpriseId], (error) => {
            if(error) {
                console.log('Enterprise Update Error: ', error);
                resolve(false);
            }
        });
        db.query('UPDATE users SET vote = ?, enterpriseId = ?, vote_date = ? WHERE email = ?', [true, enterpriseId, user.vote_date, userEmail], (error) => {
            if(error) {
                console.log('User Update Error: ', error);
                resolve(false);
            } else {
                console.log(`User with e-mail ${userEmail} just voted, database updated.`);
                resolve(true);
            }
        });
    });
}

export function getResult() {
    const result = new Object();
    result.jardinVotes = enterprises[0].votes;
    result.evianVotes = enterprises[1].votes;
    result.olimpiaVotes = enterprises[2].votes;
    result.totalVotes = result.jardinVotes + result.evianVotes + result.olimpiaVotes;
    result.whoVoted = whoVoted;
    return result;
}

function getDate(){
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear();
    return diaF+"/"+mesF+"/"+anoF;
}
