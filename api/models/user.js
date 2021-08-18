//import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export class User {

    constructor(name, email, password) {
        this.id = uuid();
        this.name = name;
        this.email = email;
        this.password = password;
        this.vote = false;
        this.interpriseId = null;
        this.vote_date = null;
        this.created_date = new Date();
    }

    /*async encryptPassword(password) {
        return bcrypt.hash(password, 10).then(function(hash) {
            return hash;
        });
    }*/
}