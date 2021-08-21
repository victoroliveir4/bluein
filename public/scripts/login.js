const auth = JSON.parse(document.currentScript.getAttribute('auth'));
const error = JSON.parse(document.currentScript.getAttribute('error'));
const alert = document.getElementById('alert');
const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('loginButton');

if(auth) {
	setError('E-mail e/ou senha inválidos.');
} else if(error) {
	loginButton.disabled = true;
	setError('Ocorreu um erro na tentativa de login, recarregue a página e tente novamente.');
}

form.onsubmit = function (event) {
	event.preventDefault();
	checkCredentials();
}

// Verifica se as credenciais do usuário são válidas, antes da requisição
async function checkCredentials() {
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
        postRequest({email: emailValue, password: passwordValue});
	}
}

// Exibe uma alerta de erro com o valor da mensagem passada
function setError(message) {
	alert.innerText = message;
	alert.className = 'alert alert-danger alert-visible';
}

// Reseta o valor do input da senha
function resetPassword() {
	password.value = '';
}

// Reseta o texto e layot de todas as inputs
function resetAllInputs() {
	email.value = '';
	password.value = '';
}

// Verifica se o formato do e-mail é válido
function checkEmail(email) {
	return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email);
}

// Requisição POST
function postRequest(params) {
	const form = document.createElement('form');
	form.method = 'POST';
	form.action = '/';
  
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