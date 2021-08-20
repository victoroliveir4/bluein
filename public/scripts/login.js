const alert = document.getElementById('alert');
const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('loginButton');

form.onsubmit = function (event) {
	event.preventDefault();
	checkCredentials();
}

// Verifica se as credenciais do usuário são válidas, antes de solicitar um POST
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
        postRequest(emailValue, passwordValue);
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
function postRequest(email, password) {
	var http = new XMLHttpRequest();
	var url = 'http://localhost:3000/';
	var params = encodeURIComponent('email') + '=' + encodeURIComponent(email) + '&' +
				encodeURIComponent('password') + '=' + encodeURIComponent(password);
	http.open('POST', url, true);
	http.withCredentials = true;

	// Recebe o status da resposta do servdidor
	http.onreadystatechange = function() {
		if(http.readyState == 4) {
			if(http.status == 200) {
				window.location.href = '/voting';
			} else if(http.status == 202) {
				window.location.href = '/computed';
			} else if(http.status == 401) {
				resetPassword();
				setError('E-mail e/ou senha inválido(s).');
			} else {
				resetAllInputs();
				loginButton.disabled = true;
				setError('Ocorreu um erro durante o login, atualize a página e tente novamente.');
			}
		}
	}
	http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	http.send(params);
}