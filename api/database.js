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
let namesWhoVoted = [];
let usersEmail = [];
fillUsers();

export function getUsersEmail() {
    return usersEmail;
}

function fillUsers() {
    db.query('SELECT id, name, email, password, vote FROM users', (error, results) => {
        if(error) {
            throw('Users Email Select Error: ', error);
        } else if(results.length > 0) {
            if(results.length == 1) {
                users.push(results[0]);
                namesWhoVoted.push(results[0].name);
                usersEmail.push(results[0].email);
            } else {
                users = results;
                users.forEach((user) => namesWhoVoted.push(user.name));
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
    const user = new User(name, email, password);
    users.push({id: user.id, name: user.name, email: user.email, password: user.password, vote: user.vote});
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
    console.log(data);
    const {userEmail, enterpriseId} = data;
    const user = users.find((user) => user.email === userEmail);
    user.vote = 1;
    namesWhoVoted.push(user.name);
    const enterprise = enterprises[enterpriseId-1];
    enterprise.votes++;
    return await new Promise((resolve) => {
        db.query('UPDATE enterprises SET votes = ? WHERE id = ?', [enterprise.votes, enterpriseId], (error) => {
            if(error) {
                console.log('Enterprise Update Error: ', error);
                resolve(false);
            }
        });
        db.query('UPDATE users SET vote = ?, enterpriseId = ?, vote_date = ? WHERE email = ?', [true, enterpriseId, new Date(), userEmail], (error) => {
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
    result.namesWhoVoted = namesWhoVoted;
    return result;
}
