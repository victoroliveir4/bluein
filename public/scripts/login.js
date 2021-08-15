//import bcrypt from '../../node_modules/bcrypt';
//import { login } from '../../index.js';
//import { users } from '../../api/database.js';

const alert = document.getElementById('alert');
const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', event => {
	event.preventDefault();
	checkCredentials();
});

async function checkCredentials() {
	// trim to remove the whitespaces
	const emailValue = email.value.trim();
	const passwordValue = password.value.trim();

	if(emailValue === '') {
		if(passwordValue === '') {
			setError('Digite seu e-mail e sua senha.');
		} else {
			resetPassword();
			setError('Digite seu e-mail.');
		}
	} else if(!checkEmail(emailValue)) {
		resetPassword();
		setError('E-mail inválido.');
	} else if(passwordValue === '') {
        setError('Digite sua senha.');
    } else {
        /*const user = users.find((user) => user.email === email);
        if(!user) {
            setError('E-mail não cadastrado.');
        } else if (!await bcrypt.compare(password, user.passwword)) {
			resetPassword();
            setError('E-mail e/ou senha incorreto(s).');
        } else {
            login();
        }*/
	}
}

function setError(message) {
	alert.innerText = message;
	alert.className = 'alert alert-danger alert-visible';
}

function resetPassword() {
	password.value = '';
}

function checkEmail(email) {
	return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email);
}