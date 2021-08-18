const usersEmail = document.currentScript.getAttribute('users');
const alert = document.getElementById('alert');
const form = document.getElementById('form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('passwordConfirm');
const registerButton = document.getElementById('registerButton');
let registerUser = true;

form.onsubmit = function (event) {
	event.preventDefault();
	checkInputs();
}

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
	} else if(JSON.parse(usersEmail).find((userEmail) => userEmail === emailValue)) {
        setError(email, 'Este e-mail já está em uso');
    } else {
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
		postRequest(nameValue, emailValue, passwordValue);
		resetAllInputs();
	} else {
		hiddeAlert();
		registerUser = true;
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

function resetAllInputs() {
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
			if(http.status == 200) {
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