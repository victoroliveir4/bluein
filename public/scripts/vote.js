const userEmail = document.currentScript.getAttribute('userEmail');
const jardinButton = document.getElementById('jardinButton');
const evianButton = document.getElementById('evianButton');
const olimpiaButton = document.getElementById('olimpiaButton');

jardinButton.onclick = function () {
	// Usuário votou no empreendimento 1 - Le Jardin
	postRequest(1);
}

evianButton.onclick = function () {
	// Usuário votou no empreendimento 2 - Evian
	postRequest(2);
}

olimpiaButton.onclick = function () {
	// Usuário votou no empreendimento 3 - Olímpia Thermas
	postRequest(3);
}

// Requisição POST
function postRequest(enterpriseId) {
	var http = new XMLHttpRequest();
	var url = 'http://54.234.126.98:3000/vote';
	var params = encodeURIComponent('userEmail') + '=' + encodeURIComponent(userEmail) + '&' +
				encodeURIComponent('enterpriseId') + '=' + encodeURIComponent(enterpriseId);
	http.open('POST', url, true);

	// Recebe o status da resposta do servdidor
	http.onreadystatechange = function() {
		if(http.readyState == 4) {
			if(http.status == 200) {
				window.location.href = '/computed';
			} else {
				window.location.href = '/logout';
			}
		}
	}
	http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	http.send(params);
}