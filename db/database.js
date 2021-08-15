import mysql from 'mysql';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Enterprise } from '../api/models/enterprise.js';
import { User } from '../api/models/user.js';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bluein'
});

db.connect((error) => {
    if(error) {
        throw('MYSQL Error: ', error);
    } else {
        console.log('MYSQL Connected...');
    }
});

export let users = await getUsers();
export let enterprises = [
    new Enterprise(1, 'Le Jardin'),
    new Enterprise(2, 'Evian'),
    new Enterprise(3, 'Olímpia Thermas')
];
await setEnterprisesVotes();

async function createDatabase() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const createSql = fs.readFileSync(path.join(__dirname, 'create.sql')).toString();
    db.query(createSql, (error) => {
        if(error) {
            throw('Create Database Error: ', error);
        } else {
            console.log(`Database created.`);
        }
    });
}

export function createUser(name, email, password) {
    const user = new User(name, email, password);
    users.push(user);
    db.query('INSERT INTO users (id, name, email, password, created_date) VALUES (?, ?, ?, ?, ?)', [user.id, user.name, user.email, user.password, user.created_date], (error) => {
        if(error) {
            throw('Create User Error: ', error);
        } else {
            console.log(`User with e-mmail [${email}] added to the database.`);
        }
    });
}

export function computeVote(userId) {
    const user = users.find((user) => user.id === userId);
    user.vote = true;
    user.enterprise = data.enterprise;
    user.vote_date = new Date();
    const enterprise = enterprises[user.enterpriseId-1];
    enterprise.votes++;
    db.query('UPDATE users SET vote = ? AND enterpriseId = ? AND vote_date = ? WHERE id = ?', [user.vote, user.enterpriseId, user.vote_date, user.id], (error) => {
        if(error) {
            throw('User Update Error: ', error);
        }
    });
    db.query('UPDATE enterprises SET votes = ? WHERE id = ?', [enterprise.votes, enterprise.id], (error, results) => {
        if(error) {
            throw('Enterprise Update Error: ', error);
        }
    });
    console.log(`User with e-mail [${user.email}] just voted, database updated.`);
}

async function getUsers() {
    return db.query('SELECT * FROM users', (error, results) => {
        if(error) {
            throw('Users Select Error: ', error);
        } else if(results.length > 0) {
            return results[0];
        }
    });
}

async function setEnterprisesVotes() {
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
