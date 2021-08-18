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
let usersEmail = [];
fillUsers();

export function getUsersEmail() {
    return usersEmail;
}

function fillUsers() {
    db.query('SELECT id, name, email, vote FROM users', (error, results) => {
        if(error) {
            throw('Users Email Select Error: ', error);
        } else if(results.length > 0) {
            if(results.length == 1) {
                users.push(results[0]);
                usersEmail.push(results[0].email);
            } else {
                users = results;
                users.forEach((user) => usersEmail.push({email: user.email}));
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

export async function requestLogin(credentials) {
    const { email, password } = credentials;
    return await new Promise((resolve, reject) => {
        db.query('SELECT id, name, vote FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
            if(error) {
                return reject('Login Select Error: ', error);
            } else if(results.length > 0) {
                return resolve(results[0]);
            } else {
                return resolve(-1);
            }
        });
    });
}

export async function createUser(userData) {
    const { name, email, password } = userData;
    const user = new User(name, email, password);
    users.push({id: user.id, name: user.name, email: user.email, vote: user.vote});
    usersEmail.push({email: user.email});
    return await new Promise((resolve, reject) => {
        db.query('INSERT INTO users (id, name, email, password, created_date) VALUES (?, ?, ?, ?, ?)', [user.id, user.name, user.email, user.password, user.created_date], (error) => {
            if(error) {
                return reject('Create User Error: ', error);
            } else {
                console.log(`User with e-mmail ${email} added to the database.`);
                return resolve(true);
            }
        });
    });
}

export async function computeVote(userId, enterpriseId) {
    const user = users.find((user) => user.id === userId);
    user.vote = 1;
    user.enterprise = enterpriseId;
    user.vote_date = new Date();
    const enterprise = enterprises[user.enterpriseId-1];
    enterprise.votes++;
    await new Promise((resolve, reject) => {
        db.query('UPDATE users SET vote = ? AND enterpriseId = ? AND vote_date = ? WHERE id = ?', [true, enterpriseId, new Date(), userId], (error) => {
            if(error) {
                return reject('User Update Error: ', error);
            }
        });
        db.query('UPDATE enterprises SET votes = ? WHERE id = ?', [enterprise.votes, enterpriseId], (error) => {
            if(error) {
                return reject('Enterprise Update Error: ', error);
            }
        });
        return resolve();
    });
    console.log(`User with id ${userId} just voted, database updated.`);
    return true;
}
