const usersEmail = JSON.parse(document.currentScript.getAttribute('usersEmail'));
const alert = document.getElementById('alert');
const form = document.getElementById('form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('passwordConfirm');
const registerButton = document.getElementById('registerButton');
let nameOk, emailOk, passwordOk, passwordConfirmOk = false;

form.onsubmit = function (event) {
	event.preventDefault();
	checkInputs();
}

name.onchange = function () {
	const nameValue = name.value.trim();
	if(nameValue === '') {
		setError(name, 'Digite seu nome');
	} else {
		setSuccess(name);
	}
}

email.onchange = function () {
	const emailValue = email.value.trim();
	if(emailValue === '') {
		setError(email, 'Digite seu e-mail');
	} else if (!checkEmail(emailValue)) {
		setError(email, 'E-mail inválido');
	} else if(usersEmail.find((email) => email === emailValue)) {
        setError(email, 'Este e-mail já está em uso');
    } else {
		setSuccess(email);
	}
}

password.onchange = function () {
	const passwordValue = password.value.trim();
	const passwordConfirmValue = passwordConfirm.value.trim();
	if(passwordValue === '') {
		resetStatus(passwordConfirm);
		setError(password, 'Digite sua senha');
	} else if(passwordConfirmValue !== '') {
		if(passwordValue !== passwordConfirmValue) {
			password.value = '';
			passwordConfirm.value = '';
			setError(password, '');
			setError(passwordConfirm, 'As senhas não coincidem');
		}
	} else {
		resetStatus(password);
	}
}

passwordConfirm.onchange = function () {
	const passwordValue = password.value.trim();
	const passwordConfirmValue = passwordConfirm.value.trim();
	if(passwordConfirmValue === '') {
		resetStatus(password);
		setError(passwordConfirm, 'Confirme sua senha');
	} else if(passwordValue !== '') {
		if(passwordValue !== passwordConfirmValue) {
			password.value = '';
			passwordConfirm.value = '';
			setError(password, '');
			setError(passwordConfirm, 'As senhas não coincidem');
		} else {
			setSuccess(password);
			setSuccess(passwordConfirm);
		}
	} else{
		resetStatus(passwordConfirm);
	}
}

function checkInputs() {
	if(nameOk && emailOk && passwordOk && confirmPasswordOk) {
		usersEmail.push(emailValue);
		postRequest(nameValue, emailValue, passwordValue);
		resetAllInputs();
	} else {
		hiddeAlert();
	}
}

function hiddeAlert() {
	alert.className = 'alert-hidden';
}

function setRegisterError(message) {
	registerButton.disabled = true;
	alert.innerText = message;
	alert.className = 'alert alert-danger alert-visible';
}

function setRegisterSuccess() {
	alert.className = 'alert alert-success alert-visible';
}

function setError(input, message) {
	switch(input) {
		case name:
			nameOk = false;
			break;
		case email:
			emailOk = false;
			break;
		case password:
			passwordOk = false;
			break;
		case passwordConfirm:
			passwordConfirmOk = false;
			break;
	}
	const formFloating = input.parentElement;
	formFloating.className = 'form-floating error';
	formFloating.querySelector('small').innerText = message;
}

function setSuccess(input) {
	switch(input) {
		case name:
			nameOk = true;
			break;
		case email:
			emailOk = true;
			break;
		case password:
			passwordOk = true;
			break;
		case passwordConfirm:
			passwordConfirmOk = true;
			break;
	}
	input.parentElement.className = 'form-floating success';
}

function resetInput(input) {
	input.value = '';
	input.parentElement.className = 'form-floating';
}

function resetAllInputs() {
	nameOk, emailOk, passwordOk, confirmPasswordOk = false;
	resetInput(name);
	resetInput(email);
	resetInput(password);
	resetInput(passwordConfirm);;
}

function resetStatus(input) {
	input.parentElement.className = 'form-floating';
}

function checkEmail(email) {
	return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email);
}

function postRequest(name, email, password) {
	var http = new XMLHttpRequest();
	var url = 'http://localhost:3000/register';
	var params = encodeURIComponent('name') + '=' + encodeURIComponent(name) + '&' +
				encodeURIComponent('email') + '=' + encodeURIComponent(email) + '&' +
				encodeURIComponent('password') + '=' + encodeURIComponent(password);
	http.open('POST', url, true);

	http.onreadystatechange = function() {
		if(http.readyState == 4) {
			if(http.status == 201) {
				setRegisterSuccess();
			} else {
				setRegisterError('Ocorreu um erro durante o cadastro, atualize a página e tente novamente.');
			}
		}
	}
	//Send the proper header information along with the request
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(params);
}