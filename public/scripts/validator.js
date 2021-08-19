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

// Validando nome do usuário no cadastro
name.onchange = function () {
	const nameValue = name.value.trim();
	if(nameValue === '') {
		setError(name, 'Digite seu nome');
	} else {
		setSuccess(name);
	}
}

// Validando e-mail do usuário no cadastro
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

// Validando senha do usuário no cadastro
password.onchange = function () {
	const passwordValue = password.value.trim();
	const passwordConfirmValue = passwordConfirm.value.trim();
	if(passwordValue === '') {
		resetStatus(passwordConfirm);
		setError(password, 'Digite sua senha');
	} else if(passwordValue.length < 6) {
		setError(password, 'A senha deve conter no mínimo 6 caracteres');
	} else if(passwordConfirmValue !== '') {
		if(passwordValue !== passwordConfirmValue) {
			password.value = '';
			passwordConfirm.value = '';
			setError(password, '');
			setError(passwordConfirm, 'As senhas não coincidem');
		} else {
			setSuccess(password);
			setSuccess(passwordConfirm);
		}
	} else {
		resetStatus(password);
	}
}

// Validando a confirmação da senha do usuário no cadastro
passwordConfirm.onchange = function () {
	const passwordValue = password.value.trim();
	const passwordConfirmValue = passwordConfirm.value.trim();
	if(passwordConfirmValue === '') {
		resetStatus(password);
		setError(passwordConfirm, 'Confirme sua senha');
	} else if(passwordConfirmValue.length < 6) {
		setError(passwordConfirm, 'A senha deve conter no mínimo 6 caracteres');
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

// Checando se todas as flags estão validadas, antes de submeter o cadastro
function checkInputs() {
	if(nameOk && emailOk && passwordOk && passwordConfirmOk) {
		const nameValue = name.value.trim();
		const emailValue = email.value.trim();
		const passwordValue = password.value.trim();
		usersEmail.push(emailValue);
		postRequest(nameValue, emailValue, passwordValue);
		resetAllInputs();
	} else {
		hiddeAlert();
	}
}

// Ocultar alerta
function hiddeAlert() {
	alert.className = 'alert-hidden';
}

// Exibe um alerta de erro e desabilita o botão de cadastro, caso o servidor responda com algum erro
function setRegisterError(message) {
	registerButton.disabled = true;
	alert.innerText = message;
	alert.className = 'alert alert-danger alert-visible';
}

// Exibe um alerta de sucesso, caso o cadastro do usuário seja confirmado
function setRegisterSuccess() {
	alert.className = 'alert alert-success alert-visible';
}

// Exibe um layot e mensagem de erro para uma input
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

// Exibe um layot e mensagem de sucesso para uma input
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

// Reseta uma input, removendo o texto e layot de erro/sucesso
function resetInput(input) {
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
	input.value = '';
	input.parentElement.className = 'form-floating';
}

// Reseta o texto e layot de todas as inputs
function resetAllInputs() {
	nameOk, emailOk, passwordOk, confirmPasswordOk = false;
	resetInput(name);
	resetInput(email);
	resetInput(password);
	resetInput(passwordConfirm);;
}

// Reseta apenas o layot de uma input
function resetStatus(input) {
	input.parentElement.className = 'form-floating';
}

// Verifica se o formato do e-mail é válido
function checkEmail(email) {
	return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email);
}

// Requisição POST
function postRequest(name, email, password) {
	var http = new XMLHttpRequest();
	var url = 'http://localhost:3000/register';
	var params = encodeURIComponent('name') + '=' + encodeURIComponent(name) + '&' +
				encodeURIComponent('email') + '=' + encodeURIComponent(email) + '&' +
				encodeURIComponent('password') + '=' + encodeURIComponent(password);
	http.open('POST', url, true);

	// Recebe o status da resposta do servdidor
	http.onreadystatechange = function() {
		if(http.readyState == 4) {
			if(http.status == 201) {
				setRegisterSuccess();
			} else {
				setRegisterError('Ocorreu um erro durante o cadastro, atualize a página e tente novamente.');
			}
		}
	}
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(params);
}