import mysql from 'mysql';
import { User } from '../api/models/user.js';

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

let usersEmail = [];
setUsersEmail();

export function getUsersEmail() {
    return usersEmail;
}

function setUsersEmail() {
    db.query('SELECT email FROM users', (error, results) => {
        if(error) {
            throw('Users Email Select Error: ', error);
        } else if(results.length > 0) {
            if(results.length == 1) {
                usersEmail.push(results[0]);
            } else {
                usersEmail = results;
            }
        }
    });
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
    usersEmail.push(user.email);
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
    await new Promise((resolve, reject) => {
        db.query('UPDATE users SET vote = ? AND enterpriseId = ? AND vote_date = ? WHERE id = ?', [true, enterpriseId, new Date(), userId], (error) => {
            if(error) {
                return reject('User Update Error: ', error);
            }
        });
        const enterpriseVotes =
        db.query('SELECT votes FROM enterprises WHERE id = ?', [enterpriseId], (error) => {
            if(error) {
                return reject('Votes Select Error: ', error);
            } else {
                return results[0];
            }
        });
        db.query('UPDATE enterprises SET votes = ? WHERE id = ?', [enterpriseVotes + 1, enterpriseId], (error) => {
            if(error) {
                return reject('Enterprise Update Error: ', error);
            }
        });
        return resolve();
    });
    console.log(`User with id ${userId} just voted, database updated.`);
    return true;
}
