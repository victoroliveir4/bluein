const alert = document.getElementById('alert');
const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('loginButton');

form.onsubmit = function (event) {
	event.preventDefault();
	checkCredentials();
}

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
        postRequest(emailValue, passwordValue);
	}
}

function setError(message) {
	alert.innerText = message;
	alert.className = 'alert alert-danger alert-visible';
}

function resetPassword() {
	password.value = '';
}

function resetAllInputs() {
	email.value = '';
	password.value = '';
}

function checkEmail(email) {
	return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email);
}

function postRequest(email, password) {
	var http = new XMLHttpRequest();
	var url = 'http://localhost:3000/';
	var params = encodeURIComponent('email') + '=' + encodeURIComponent(email) + '&' +
				encodeURIComponent('password') + '=' + encodeURIComponent(password);
	http.open('POST', url, true);
	http.withCredentials = true;

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
	//Send the proper header information along with the request
	http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	http.send(params);
}