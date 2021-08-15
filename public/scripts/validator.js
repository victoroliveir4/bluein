//import { users, createUser } from '../../api/database.js';

const alert = document.getElementById('alert');
const form = document.getElementById('form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('passwordConfirm');
let registerUser = true;

form.addEventListener('submit', event => {
	event.preventDefault();
	checkInputs();
});

function checkInputs() {
	// trim to remove the whitespaces
	const nameValue = name.value.trim();
	const emailValue = email.value.trim();
	const passwordValue = password.value.trim();
	const passwordConfirmValue = passwordConfirm.value.trim();

	if(nameValue === '') {
		setError(name, 'Digite seu nome');
	} else {
		setSuccess(name);
	}

	if(emailValue === '') {
		setError(email, 'Digite seu e-mail');
	} else if (!checkEmail(emailValue)) {
		setError(email, 'E-mail inválido');
	} /*else if(users.find((user) => user.email === email)) {
        setError(email, 'Este e-mail já está em uso');
    }*/else {
		setSuccess(email);
	}

	if(passwordValue === '') {
		if(passwordConfirmValue === '') {
			setError(password, 'Digite sua senha');
			setError(passwordConfirm, 'Confirme sua senha');
		} else {
			resetStatus(passwordConfirm);
			setError(password, 'Digite sua senha');
		}
	} else if(passwordConfirmValue === '') {
		resetStatus(password);
		setError(passwordConfirm, 'Confirme sua senha');
	} else if(passwordValue !== passwordConfirmValue) {
		password.value = '';
		passwordConfirm.value = '';
		setError(password, '');
		setError(passwordConfirm, 'As senhas não coincidem');
	} else{
		setSuccess(password);
		setSuccess(passwordConfirm);
	}

	if(registerUser) {
		resetInput(name);
		resetInput(email);
		resetInput(password);
		resetInput(passwordConfirm);
		//createUser(nameValue, emailValue, passwordValue);
		alert.className = 'alert alert-success alert-visible';
	} else {
		alert.className = 'alert-hidden';
		registerUser = true;
	}
}

function setError(input, message) {
	const formFloating = input.parentElement;
	formFloating.className = 'form-floating error';
	formFloating.querySelector('small').innerText = message;
	registerUser = false;
}

function setSuccess(input) {
	input.parentElement.className = 'form-floating success';
}

function resetInput(input) {
	input.value = '';
	input.parentElement.className = 'form-floating';
}

function resetStatus(input) {
	input.parentElement.className = 'form-floating';
}

function checkEmail(email) {
	return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email);
}