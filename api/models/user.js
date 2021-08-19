import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export class User {

    constructor(name, email, password, created_date) {
        this.id = uuid();
        this.name = name;
        this.email = email;
        this.password = password;
        this.vote = false;
        this.interpriseId = null;
        this.vote_date = null;
        this.created_date = created_date;
    }

    async encryptPassword(password) {
        return await new Promise((resolve) => {
            resolve(bcrypt.hash(password));
        });
    }
}