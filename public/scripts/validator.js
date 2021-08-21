const registeredUser = JSON.parse(document.currentScript.getAttribute('registeredUser'));
const error = JSON.parse(document.currentScript.getAttribute('error'));
const alert = document.getElementById('alert');
const form = document.getElementById('form');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('passwordConfirm');
const registerButton = document.getElementById('registerButton');
let nameOk, emailOk, passwordOk, passwordConfirmOk = false;
if(!error) var usersEmail = JSON.parse(document.currentScript.getAttribute('usersEmail'));

if(registeredUser) {
	setRegisterSuccess();
} else if(error) {
	setRegisterError();
}

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

// Checando se todos os inputs foram validados, antes de submeter o cadastro
function checkInputs() {
	const nameValue = name.value.trim();
	const emailValue = email.value.trim();
	const passwordValue = password.value.trim();
	const passwordConfirmValue = passwordConfirm.value.trim();
	if(nameOk && emailOk && passwordOk && passwordConfirmOk) {
		usersEmail.push(emailValue);
		postRequest({name: nameValue, email: emailValue, password: passwordValue});
	} else {
		hiddeAlert();
		setRequiredFields(nameValue, emailValue, passwordValue, passwordConfirmValue);
	}
}

// Exibe uma mensagem de campo obrigatório para os inputs vazios
function setRequiredFields(nameValue, emailValue, passwordValue, passwordConfirmValue) {
	if(nameValue == '') {
		setError(name, 'Cammpo obrigatório');
	}
	if(emailValue == '') {
		setError(email, 'Cammpo obrigatório');
	}
	if(passwordValue == '') {
		setError(password, 'Cammpo obrigatório');
	}
	if(passwordConfirmValue == '') {
		setError(passwordConfirm, 'Cammpo obrigatório');
	}
}

// Ocultar alerta
function hiddeAlert() {
	alert.className = 'alert-hidden';
}

// Exibe um alerta de falha e desabilita o botão de cadastro, caso o servidor responda com algum erro
function setRegisterError() {
	name.disabled = true;
	email.disabled = true;
	password.disabled = true;
	passwordConfirm.disabled = true;
	registerButton.disabled = true;
	alert.innerText = 'Falha ao cadastrar usuário, recarregue a página e tente novamente';
	alert.className = 'alert alert-danger alert-visible';
}

// Exibe um alerta de sucesso, caso o cadastro do usuário seja confirmado
function setRegisterSuccess() {
	alert.className = 'alert alert-success alert-visible';
}

// Exibe um layot e mensagem de erro para uma input
function setError(input, message) {
	validateInput(input, false);
	const formFloating = input.parentElement;
	formFloating.className = 'form-floating error';
	formFloating.querySelector('small').innerText = message;
}

// Exibe um layot e mensagem de sucesso para uma input
function setSuccess(input) {
	validateInput(input, true);
	input.parentElement.className = 'form-floating success';
}

// Reseta uma input, removendo o texto e layot de erro/sucesso
function resetInput(input) {
	validateInput(input, false);
	input.value = '';
	input.parentElement.className = 'form-floating';
}

// Valida ou invalida uma input
function validateInput(input, bool) {
	switch(input) {
		case name:
			nameOk = bool;
			break;
		case email:
			emailOk = bool;
			break;
		case password:
			passwordOk = bool;
			break;
		case passwordConfirm:
			passwordConfirmOk = bool;
			break;
	}
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
function postRequest(params) {
	const form = document.createElement('form');
	form.method = 'POST';
	form.action = '/register';
  
	for (const key in params) {
	  if (params.hasOwnProperty(key)) {
		const hiddenField = document.createElement('input');
		hiddenField.type = 'hidden';
		hiddenField.name = key;
		hiddenField.value = params[key];
		form.appendChild(hiddenField);
	  }
	}
	document.body.appendChild(form);
	form.submit();
  }